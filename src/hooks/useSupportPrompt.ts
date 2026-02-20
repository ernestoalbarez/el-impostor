import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSupportData, saveSupportData } from '@/engine/storageService';

export const useSupportPrompt = () => {
    const navigate = useNavigate();
    const [shouldShow, setShouldShow] = useState(false);

    useEffect(() => {
        const data = getSupportData();

        if (data.neverShow) {
            setShouldShow(false);
            return;
        }

        // Show after 5 games, then every 10 additional games (15, 25, 35...)
        const isInitialTrigger = data.totalGames >= 5 && data.gamesSincePrompt >= 5;
        const isRecurringTrigger = data.totalGames > 5 && data.gamesSincePrompt >= 10;

        if (isInitialTrigger || isRecurringTrigger) {
            setShouldShow(true);
        }
    }, []);

    const handleSupport = useCallback(() => {
        const data = getSupportData();
        saveSupportData({
            ...data,
            gamesSincePrompt: 0,
        });
        setShouldShow(false);
        navigate('/support');
    }, [navigate]);

    const handleLater = useCallback(() => {
        const data = getSupportData();
        saveSupportData({
            ...data,
            gamesSincePrompt: 0,
        });
        setShouldShow(false);
    }, []);

    const handleNeverShowAgain = useCallback(() => {
        const data = getSupportData();
        saveSupportData({
            ...data,
            neverShow: true,
        });
        setShouldShow(false);
    }, []);

    return {
        shouldShow,
        handleSupport,
        handleLater,
        handleNeverShowAgain,
    };
};
