import React, { createContext, useContext, useState, useEffect } from 'react';

interface AppSettings {
    isGirlVoice: boolean;
    magicEffects: boolean;
    bgMusic: boolean;
}

interface AppSettingsContextType {
    settings: AppSettings;
    updateSetting: (key: keyof AppSettings, value: boolean) => void;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export const AppSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<AppSettings>(() => {
        const saved = localStorage.getItem('app-settings');
        return saved ? JSON.parse(saved) : {
            isGirlVoice: true,
            magicEffects: true,
            bgMusic: false,
        };
    });

    useEffect(() => {
        localStorage.setItem('app-settings', JSON.stringify(settings));

        // Global variable for non-react functions like speakText
        (window as any)._appSettings = settings;
    }, [settings]);

    const updateSetting = (key: keyof AppSettings, value: boolean) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <AppSettingsContext.Provider value={{ settings, updateSetting }}>
            {children}
        </AppSettingsContext.Provider>
    );
};

export const useAppSettings = () => {
    const context = useContext(AppSettingsContext);
    if (context === undefined) {
        throw new Error('useAppSettings must be used within an AppSettingsProvider');
    }
    return context;
};
