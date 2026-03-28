import { useToast } from '@/hooks/use-toast';
import { useCallback } from 'react';

export const useNotifications = () => {
  const { toast } = useToast();

  const notifyXP = useCallback((amount: number) => {
    toast({
      title: `⚡ +${amount} XP`,
      description: 'Keep grinding, warrior!',
      duration: 3000,
    });
  }, [toast]);

  const notifyLevelUp = useCallback((level: number) => {
    toast({
      title: `🎉 LEVEL UP!`,
      description: `You reached Level ${level}!`,
      duration: 5000,
    });
  }, [toast]);

  const notifyMatchFound = useCallback((opponent: string) => {
    toast({
      title: `⚔️ Match Found!`,
      description: `Your opponent: ${opponent}`,
      duration: 4000,
    });
  }, [toast]);

  const notifyQuestComplete = useCallback((title: string) => {
    toast({
      title: `✅ Quest Complete!`,
      description: `"${title}" conquered!`,
      duration: 3000,
    });
  }, [toast]);

  return { notifyXP, notifyLevelUp, notifyMatchFound, notifyQuestComplete };
};
