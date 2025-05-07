import React, { createContext, useContext, useEffect, useState } from 'react';

// Types for our analytics
interface ReadingSession {
  categoryId: string;
  startTime: number;
  endTime?: number;
  duration?: number;
}

interface CategoryAnalytics {
  categoryId: string;
  totalTimeSpent: number; // in milliseconds
  sessions: number;
  lastRead: Date;
  averageSessionDuration: number;
}

interface ReadingAnalytics {
  categories: Record<string, CategoryAnalytics>;
  currentSession: ReadingSession | null;
  totalReadingTime: number;
  lastUpdated: Date;
}

interface ReadingAnalyticsContextType {
  analytics: ReadingAnalytics;
  startReading: (categoryId: string) => void;
  stopReading: () => void;
  getCategoryStats: (categoryId: string) => CategoryAnalytics | undefined;
  getTotalReadingTime: () => number;
  getMostReadCategory: () => string | null;
  resetAnalytics: () => void;
}

const ReadingAnalyticsContext = createContext<ReadingAnalyticsContextType | undefined>(undefined);

const initialAnalytics: ReadingAnalytics = {
  categories: {},
  currentSession: null,
  totalReadingTime: 0,
  lastUpdated: new Date(),
};

export const ReadingAnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [analytics, setAnalytics] = useState<ReadingAnalytics>(() => {
    const saved = sessionStorage.getItem('readingAnalytics');
    return saved ? JSON.parse(saved) : initialAnalytics;
  });

  // Save analytics to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('readingAnalytics', JSON.stringify(analytics));
  }, [analytics]);

  const startReading = (categoryId: string) => {
    if (analytics.currentSession) {
      stopReading(); // Stop any existing session
    }

    setAnalytics(prev => ({
      ...prev,
      currentSession: {
        categoryId,
        startTime: Date.now(),
      },
      lastUpdated: new Date(),
    }));
  };

  const stopReading = () => {
    if (!analytics.currentSession) return;

    const endTime = Date.now();
    const duration = endTime - analytics.currentSession.startTime;
    const { categoryId } = analytics.currentSession;

    setAnalytics(prev => {
      const category = prev.categories[categoryId] || {
        categoryId,
        totalTimeSpent: 0,
        sessions: 0,
        lastRead: new Date(),
        averageSessionDuration: 0,
      };

      const updatedCategory = {
        ...category,
        totalTimeSpent: category.totalTimeSpent + duration,
        sessions: category.sessions + 1,
        lastRead: new Date(),
        averageSessionDuration: (category.totalTimeSpent + duration) / (category.sessions + 1),
      };

      return {
        ...prev,
        categories: {
          ...prev.categories,
          [categoryId]: updatedCategory,
        },
        currentSession: null,
        totalReadingTime: prev.totalReadingTime + duration,
        lastUpdated: new Date(),
      };
    });
  };

  const getCategoryStats = (categoryId: string) => {
    return analytics.categories[categoryId];
  };

  const getTotalReadingTime = () => analytics.totalReadingTime;

  const getMostReadCategory = () => {
    const categories = Object.values(analytics.categories);
    if (categories.length === 0) return null;

    return categories.reduce((max, current) => 
      current.totalTimeSpent > (max?.totalTimeSpent || 0) ? current : max
    ).categoryId;
  };

  const resetAnalytics = () => {
    setAnalytics(initialAnalytics);
    sessionStorage.removeItem('readingAnalytics');
  };

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && analytics.currentSession) {
        stopReading();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [analytics.currentSession]);

  // Reset analytics when the page is refreshed
  useEffect(() => {
    const handleBeforeUnload = () => {
      resetAnalytics();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <ReadingAnalyticsContext.Provider
      value={{
        analytics,
        startReading,
        stopReading,
        getCategoryStats,
        getTotalReadingTime,
        getMostReadCategory,
        resetAnalytics,
      }}
    >
      {children}
    </ReadingAnalyticsContext.Provider>
  );
};

export const useReadingAnalytics = () => {
  const context = useContext(ReadingAnalyticsContext);
  if (context === undefined) {
    throw new Error('useReadingAnalytics must be used within a ReadingAnalyticsProvider');
  }
  return context;
}; 