class Overwatch {
    static current_tier;
    static current_tier_xp;
    static expected_weeklies;
    static expected_play_days;
    static expected_dailies;
    static expected_daily_matches;
    static expected_match_xp;

    static currentSeasonStart() {
        return new Date('2022-10-04');
    }

    static currentSeasonEnd() {
        return new Date('2022-12-06');
    }

    static remainingDays() {
        return (this.currentSeasonEnd() - new Date()) / 86400000;
    }

    static currentDay() {
        return (new Date() - this.currentSeasonStart()) / 86400000;
    }

    static currentTier() {
        return this.current_tier;
    }

    static currentCompletedTier() {
        return Math.max(this.currentTier() - 1, 0);
    }

    static currentTierXp() {
        return this.current_tier_xp;
    }

    static currentXp() {
        return (this.currentCompletedTier() * 10000) + this.currentTierXp();
    }

    static currentPercent() {
        return (this.currentCompletedTier() / 80) * 100;
    }

    static remainingTiers() {
        return 80 - this.currentCompletedTier();
    }

    static remainingXp() {
        return (80 * 10000) - this.currentXp();
    }

    static remainingPercent() {
        return (this.remainingTiers() / 80) * 100;
    }

    static dailyAverageTiers() {
        return this.currentCompletedTier() / this.currentDay();
    }

    static dailyAverageXp() {
        return this.currentXp() / this.currentDay();
    }

    static dailyAveragePercent() {
        return this.currentPercent() / this.currentDay();
    }

    static weeklyAverageTiers() {
        return this.dailyAverageTiers() * 7;
    }

    static weeklyAverageXp() {
        return this.dailyAverageXp() * 7;
    }

    static weeklyAveragePercent() {
        return this.dailyAveragePercent() * 7;
    }

    static dailyGoalTiers() {
        return this.remainingTiers() / this.remainingDays();
    }

    static dailyGoalXp() {
        return this.remainingXp() / this.remainingDays();
    }

    static dailyGoalPercent() {
        return this.remainingPercent() / this.remainingDays();
    }

    static weeklyGoalTiers() {
        return this.dailyGoalTiers() * 7;
    }

    static weeklyGoalXp() {
        return this.dailyGoalXp() * 7;
    }

    static weeklyGoalPercent() {
        return this.dailyGoalPercent() * 7;
    }

    static expectedPlayDays() {
        return this.expected_play_days;
    }

    static expectedDailies() {
        return this.expected_dailies;
    }

    static expectedWeeklies() {
        return this.expected_weeklies;
    }

    static expectedDailyMatches() {
        return this.expected_daily_matches;
    }

    static expectedMatchXp() {
        return this.expected_match_xp;
    }

    static expectedDailyMatchXp() {
        return ((this.expectedDailyMatches() * this.expectedMatchXp()) * this.expectedPlayDays()) / 7;
    }

    static expectedDailyDailiesXp() {
        let dailyXp = 0;

        if (this.expectedDailies() >= 3) dailyXp = 9000;
        else if (this.expectedDailies() >= 2) dailyXp = 6000;
        else if (this.expectedDailies() >= 1) dailyXp = 3000;
        else return 0;

        return (dailyXp * this.expectedPlayDays()) / 7;
    }

    static expectedDailyWeekliesXp() {
        return (this.expectedWeeklies() * 5000) / 7;
    }

    static expectedDailyTiers() {
        return this.expectedDailyXp() / 10000;
    }

    static expectedDailyXp() {
        return this.expectedDailyMatchXp() + this.expectedDailyDailiesXp() + this.expectedDailyWeekliesXp();
    }

    static expectedDailyPercent() {
        return (this.expectedDailyXp() / 800000) * 100;
    }

    static expectedWeeklyTiers() {
        return this.expectedDailyTiers() * 7;
    }

    static expectedWeeklyXp() {
        return this.expectedDailyXp() * 7;
    }

    static expectedWeeklyPercent() {
        return this.expectedDailyPercent() * 7;
    }

    static expectedXp() {
        return this.expectedDailyXp() * this.remainingDays();
    }

    static projectedTiers() {
        let expecting = this.currentXp() + (this.dailyAverageXp() * this.remainingDays());
        return Math.floor(expecting / 10000);
    }

    static projectedSpareDays() {
        let required = 80 * 10000;
        let have = this.currentXp();
        let need = required - have;
        let expecting = this.dailyAverageXp() * this.remainingDays();
        let extra = expecting - need;
        return extra / this.dailyAverageXp();
    }

    static projectedSpareTiers() {
        let required = 80 * 10000;
        let have = this.currentXp();
        let need = required - have;
        let expecting = this.dailyAverageXp() * this.remainingDays();
        let missing = need - expecting;
        return Math.ceil(missing / 10000);
    }

    static projectedSpareTiersCost() {
        return this.projectedSpareTiers() * 200;
    }

    static projectedSpareTiersCostUsd() {
        return this.projectedSpareTiersCost() / 100;
    }

    static projectedPrestigeTiers() {
        let have = this.currentXp();
        let projecting = this.dailyAverageXp() * this.remainingDays();
        let total = have + projecting;
        return Math.min(Math.floor(total / 10000) - 80, 200 - 80);
    }

    static projectedPrestigeTierTitles() {
        let extraTiers = this.projectedPrestigeTiers();
        return this.titlesFromTiers(extraTiers + 80);
    }

    static expectedTiers() {
        let expecting = this.currentXp() + this.expectedXp();
        return Math.floor(expecting / 10000);
    }

    static expectedSpareDays() {
        let required = 80 * 10000;
        let have = this.currentXp();
        let need = required - have;
        let expecting = this.expectedXp();
        let extra = expecting - need;
        return extra / this.expectedDailyXp();
    }

    static expectedSpareTiers() {
        let required = 80 * 10000;
        let have = this.currentXp();
        let need = required - have;
        let expecting = this.expectedXp();
        let missing = need - expecting;
        return Math.ceil(missing / 10000);
    }

    static expectedSpareTiersCost() {
        return this.expectedSpareTiers() * 200;
    }

    static expectedSpareTiersCostUsd() {
        return this.expectedSpareTiersCost() / 100;
    }

    static expectedPrestigeTiers() {
        let have = this.currentXp();
        let expecting = this.expectedXp();
        let total = have + expecting;
        return Math.min(Math.floor(total / 10000) - 80, 200 - 80);
    }

    static expectedPrestigeTierTitles() {
        let extraTiers = this.expectedPrestigeTiers();
        return this.titlesFromTiers(extraTiers + 80);
    }

    static titlesFromTiers(tiers) {
        if (tiers >= 200) return 8;
        else if (tiers >= 175) return 7;
        else if (tiers >= 155) return 6;
        else if (tiers >= 135) return 5;
        else if (tiers >= 120) return 4;
        else if (tiers >= 105) return 3;
        else if (tiers >= 95) return 2;
        else if (tiers >= 85) return 1;
        else return 0;
    }

    static daysPerLegendary() {
        let weekly = 0;
        if (this.expectedWeeklies() >= 4) {
            weekly = 30;
        }
        if (this.expectedWeeklies() >= 8) {
            weekly = 50;
        }
        if (this.expectedWeeklies() >= 11) {
            weekly = 60;
        }
        return (2000 / weekly) * 7;
    }

    static daysPerBattlePass() {
        let weekly = 0;
        if (this.expectedWeeklies() >= 4) {
            weekly = 30;
        }
        if (this.expectedWeeklies() >= 8) {
            weekly = 50;
        }
        if (this.expectedWeeklies() >= 11) {
            weekly = 60;
        }
        return (1000 / weekly) * 7;
    }
}