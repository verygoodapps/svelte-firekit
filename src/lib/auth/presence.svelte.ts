import { ref, onDisconnect, onValue, get, set } from 'firebase/database';
import { firebaseService } from '../firebase.js';
import { browser } from '$app/environment';

/**
 * Geolocation configuration options
 */
interface GeolocationConfig {
    /** Whether geolocation tracking is enabled */
    enabled: boolean;
    /** Type of geolocation service to use */
    type: 'browser' | 'ip' | 'custom';
    /** Custom function for retrieving geolocation */
    customGeolocationFn?: () => Promise<{ latitude: number; longitude: number; }>;
    /** URL for IP-based geolocation service */
    ipServiceUrl?: string;
    /** Whether user consent is required for location tracking */
    requireConsent?: boolean;
}

/**
 * Presence service configuration options
 */
interface PresenceConfig {
    /** Geolocation settings */
    geolocation?: GeolocationConfig;
    /** Session timeout in milliseconds */
    sessionTTL?: number;
    /** Presence update interval in milliseconds */
    updateInterval?: number;
}

/**
 * Location data structure
 */
interface Location {
    latitude: number | null;
    longitude: number | null;
    lastUpdated: string | null;
}

/**
 * Session data structure
 */
interface SessionData {
    uid: string;
    userId: string;
    deviceId: string;
    status: 'online' | 'offline' | 'away';
    createdAt: string;
    lastSeen: string;
    location?: Location;
}

/**
 * Presence event structure
 */
type PresenceEvent = {
    type: 'status_change' | 'error' | 'init' | 'disconnect' | 'location_update';
    data?: any;
    error?: Error;
    timestamp: number;
};

type PresenceEventCallback = (event: PresenceEvent) => void;

/**
 * Manages real-time user presence tracking with optional geolocation support
 * @class
 * @example
 * ```typescript
 * // Initialize presence tracking
 * await presenceService.initialize(currentUser, {
 *   geolocation: { enabled: true, type: 'browser' },
 *   sessionTTL: 30 * 60 * 1000
 * });
 * 
 * // Listen for presence events
 * presenceService.addEventListener((event) => {
 *   console.log(event.type, event.data);
 * });
 * ```
 */
class PresenceService {
    private static instance: PresenceService;
    private connectedListener: (() => void) | null = null;
    private locationWatcher: number | null = null;
    private currentUser: any = null;
    private eventListeners: Set<PresenceEventCallback> = new Set();
    private config: PresenceConfig = {
        geolocation: {
            enabled: false,
            type: 'browser',
            requireConsent: true
        },
        sessionTTL: 30 * 60 * 1000, // 30 minutes
        updateInterval: 60 * 1000 // 1 minute
    };

    private initialized = $state(false);
    private locationConsent = $state(false);

    private _currentSession = $state<SessionData | null>(null);
    private _sessions = $state<SessionData[]>([]);
    private _status = $state<SessionData['status']>('offline');
    private _loading = $state(true);
    private _error = $state<Error | null>(null);

    private constructor() {
        if (browser) {
            this.setupVisibilityListener();
        }
    }

    static getInstance(): PresenceService {
        if (!PresenceService.instance) {
            PresenceService.instance = new PresenceService();
        }
        return PresenceService.instance;
    }

    // Getters

    /** Get current session data */
    get currentSession() { return this._currentSession; }
    /** Get all active sessions */
    get sessions() { return this._sessions; }
    /** Get current presence status */
    get status() { return this._status; }
    /** Get loading state */
    get loading() { return this._loading; }
    /** Get error state */
    get error() { return this._error; }
    /** Check if service is initialized */
    get isInitialized() { return this.initialized; }
    /** Check if location consent is granted */
    get hasLocationConsent() { return this.locationConsent; }

    /**
 * Initialize presence tracking
 * @param {any} user Current user object
 * @param {PresenceConfig} config Optional configuration
 * @throws {Error} If initialization fails
 */

    private async initializePresence() {
        const connectedRef = ref(firebaseService.getDatabaseInstance(), '.info/connected');

        this.connectedListener = onValue(connectedRef, async (snapshot) => {
            if (snapshot.val() === true) {
                await this.setPresence('online');
                const userStatusRef = ref(
                    firebaseService.getDatabaseInstance(),
                    `sessions/${this.currentUser.uid}`
                );

                // Set up disconnect hook
                await onDisconnect(userStatusRef).set({
                    sessionDatas: this._sessions.map(session => ({
                        ...session,
                        status: 'offline',
                        lastSeen: new Date().toISOString()
                    }))
                });
            } else {
                await this.setPresence('offline');
            }
        });

        // Set up visibility change listener
        if (browser) {
            document.onvisibilitychange = async () => {
                if (document.visibilityState === 'hidden') {
                    await this.setPresence('away');
                } else {
                    await this.setPresence('online');
                }
            };
        }
    }

    private setupVisibilityListener() {
        if (browser) {
            document.onvisibilitychange = async () => {
                if (this.initialized) {
                    if (document.visibilityState === 'hidden') {
                        await this.setPresence('away');
                    } else {
                        await this.setPresence('online');
                    }
                }
            };
        }
    }

    private getDeviceInfo(): string {
        const userAgent = navigator.userAgent;
        const platform = navigator.platform;
        const browserInfo = userAgent.match(/(firefox|chrome|safari|opera|edge|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        const browser = browserInfo[1] || 'Unknown Browser';

        return `${browser}-${platform}`.replace(/[^a-zA-Z0-9-]/g, '');
    }

    /**
    * Request location tracking consent
    * @returns {Promise<boolean>} Whether consent was granted
    */

    async requestLocationConsent(): Promise<boolean> {
        if (!this.config.geolocation?.enabled) return false;

        try {
            if (this.config.geolocation.type === 'browser') {
                const permission = await navigator.permissions.query({ name: 'geolocation' });
                if (permission.state === 'granted') {
                    this.locationConsent = true;
                    return true;
                }

                const result = await new Promise<boolean>((resolve) => {
                    navigator.geolocation.getCurrentPosition(
                        () => resolve(true),
                        () => resolve(false),
                        { timeout: 10000 }
                    );
                });

                this.locationConsent = result;
                return result;
            }
            return true;
        } catch (error) {
            console.error('Error requesting location consent:', error);
            return false;
        }
    }

    private async getLocation(): Promise<Location | null> {
        if (!this.config.geolocation?.enabled ||
            (this.config.geolocation.requireConsent && !this.locationConsent)) {
            return null;
        }

        try {
            switch (this.config.geolocation.type) {
                case 'browser':
                    return new Promise((resolve) => {
                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                resolve({
                                    latitude: position.coords.latitude,
                                    longitude: position.coords.longitude,
                                    lastUpdated: new Date().toISOString()
                                });
                            },
                            () => resolve(null),
                            { timeout: 10000 }
                        );
                    });

                case 'custom':
                    if (this.config.geolocation.customGeolocationFn) {
                        const result = await this.config.geolocation.customGeolocationFn();
                        return {
                            ...result,
                            lastUpdated: new Date().toISOString()
                        };
                    }
                    return null;

                case 'ip':
                    if (this.config.geolocation.ipServiceUrl) {
                        const response = await fetch(this.config.geolocation.ipServiceUrl);
                        const data = await response.json();
                        return {
                            latitude: data.latitude,
                            longitude: data.longitude,
                            lastUpdated: new Date().toISOString()
                        };
                    }
                    return null;

                default:
                    return null;
            }
        } catch (error) {
            console.error('Error getting location:', error);
            return null;
        }
    }

    async initialize(user: any, config?: PresenceConfig): Promise<void> {
        try {
            if (!browser) {
                throw new Error('Presence service can only be initialized in browser environment');
            }

            if (this.initialized) {
                console.warn('Presence service is already initialized');
                return;
            }

            this._loading = true;
            this.currentUser = user;
            this.config = { ...this.config, ...config };

            // If geolocation is enabled and requires consent, request it
            if (this.config.geolocation?.enabled && this.config.geolocation.requireConsent) {
                await this.requestLocationConsent();
            }

            await this.initializePresence();
            this.initialized = true;

            // Start location watcher if enabled and has consent
            if (this.config.geolocation?.enabled &&
                (!this.config.geolocation.requireConsent || this.locationConsent)) {
                this.startLocationWatcher();
            }

            this.emitEvent({
                type: 'init',
                data: { userId: user.uid },
                timestamp: Date.now()
            });
        } catch (error) {
            this._error = error as Error;
            this.emitEvent({
                type: 'error',
                error: error as Error,
                timestamp: Date.now()
            });
            throw error;
        } finally {
            this._loading = false;
        }
    }

    private async setPresence(status: SessionData['status']) {
        try {
            if (!this.currentUser) {
                throw new Error('No authenticated user found');
            }

            const db = firebaseService.getDatabaseInstance();
            const userSessionsRef = ref(db, `sessions/${this.currentUser.uid}`);
            const deviceId = this.getDeviceInfo();
            const sessionId = `${this.currentUser.uid}_${deviceId}`;

            // Get location if enabled
            const location = await this.getLocation();

            const userSessionsSnap = await get(userSessionsRef);
            let sessionDatas: SessionData[] = [];

            if (userSessionsSnap.exists()) {
                sessionDatas = userSessionsSnap.val().sessionDatas || [];
                const sessionIndex = sessionDatas.findIndex((session) => session.uid === sessionId);

                if (sessionIndex !== -1) {
                    // Update existing session
                    sessionDatas[sessionIndex] = {
                        ...sessionDatas[sessionIndex],
                        status,
                        lastSeen: new Date().toISOString(),
                        ...(location && { location })
                    };
                } else {
                    // Create new session
                    sessionDatas.push({
                        uid: sessionId,
                        userId: this.currentUser.uid,
                        deviceId,
                        status,
                        createdAt: new Date().toISOString(),
                        lastSeen: new Date().toISOString(),
                        ...(location && { location })
                    });
                }
            } else {
                // First session for this user
                sessionDatas = [{
                    uid: sessionId,
                    userId: this.currentUser.uid,
                    deviceId,
                    status,
                    createdAt: new Date().toISOString(),
                    lastSeen: new Date().toISOString(),
                    ...(location && { location })
                }];
            }

            // Clean up stale sessions
            if (this.config.sessionTTL) {
                const cutoffTime = new Date(Date.now() - this.config.sessionTTL).toISOString();
                sessionDatas = sessionDatas.filter(session => session.lastSeen >= cutoffTime);
            }

            await set(userSessionsRef, { sessionDatas });

            this._sessions = sessionDatas;
            this._currentSession = sessionDatas.find(session => session.uid === sessionId) || null;
            this._status = status;

            this.emitEvent({
                type: 'status_change',
                data: { status, sessionId, location },
                timestamp: Date.now()
            });
        } catch (error) {
            this._error = error as Error;
            this.emitEvent({
                type: 'error',
                error: error as Error,
                timestamp: Date.now()
            });
            throw error;
        }
    }

    private startLocationWatcher() {
        if (this.locationWatcher) return;

        const watchLocation = async () => {
            const location = await this.getLocation();
            if (location && this._currentSession) {
                await this.setPresence(this._status);
                this.emitEvent({
                    type: 'location_update',
                    data: { location },
                    timestamp: Date.now()
                });
            }
        };

        // Update location periodically
        this.locationWatcher = window.setInterval(
            watchLocation,
            this.config.updateInterval
        );
    }

    private stopLocationWatcher() {
        if (this.locationWatcher) {
            clearInterval(this.locationWatcher);
            this.locationWatcher = null;
        }
    }
    /**
      * Add presence event listener
      * @param {Function} callback Event callback function
      * @returns {Function} Cleanup function to remove listener
      */
    addEventListener(callback: PresenceEventCallback) {
        this.eventListeners.add(callback);
        return () => this.eventListeners.delete(callback);
    }

    private emitEvent(event: PresenceEvent) {
        this.eventListeners.forEach(callback => callback(event));
    }
    /**
         * Cleanup presence tracking
         */
    dispose() {
        this.stopLocationWatcher();
        if (this.connectedListener) {
            this.connectedListener();
            this.connectedListener = null;
        }
        this.initialized = false;
        this._currentSession = null;
        this._sessions = [];
        this._status = 'offline';
        this._loading = false;
        this._error = null;

        this.emitEvent({
            type: 'disconnect',
            timestamp: Date.now()
        });
    }
}

export const presenceService = PresenceService.getInstance();