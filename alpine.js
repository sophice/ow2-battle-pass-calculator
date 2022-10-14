if (!Number.prototype.$floor) {
    Number.prototype.$floor = function (decimals) {
        if (typeof decimals === 'undefined') {
            decimals = 0;
        }
        return Math.floor(
            this * Math.pow(10, decimals)
        ) / Math.pow(10, decimals);
    };
}

if (!Number.prototype.$ceil) {
    Number.prototype.$ceil = function (decimals) {
        if (typeof decimals === 'undefined') {
            decimals = 0;
        }
        return Math.ceil(
            this * Math.pow(10, decimals)
        ) / Math.pow(10, decimals);
    };
}

if (!Number.prototype.$round) {
    Number.prototype.$round = function (decimals) {
        if (typeof decimals === 'undefined') {
            decimals = 0;
        }
        return Math.round(
            this * Math.pow(10, decimals)
        ) / Math.pow(10, decimals);
    };
}

if (!Number.prototype.$localize) {
    Number.prototype.$localize = function (decimals) {
        let options = {};
        if (typeof decimals !== 'undefined') {
            options.maximumFractionDigits = decimals;
        }
        return new Intl.NumberFormat(undefined, options).format(this);
    };
}

if (!Number.prototype.$currency) {
    Number.prototype.$currency = function (decimals) {
        let options = {};
        if (typeof decimals === 'undefined') {
            decimals = 2;
        }
        options.maximumFractionDigits = decimals;
        return new Intl.NumberFormat(undefined, options).format(this);
    };
}


document.addEventListener('alpine:init', () => {
    Alpine.data('overwatch', function () {
        return {
            //inputs
            current_tier: this.$persist(1),
            current_tier_xp: this.$persist(0),
            expected_weeklies: this.$persist(8),
            expected_play_days: this.$persist(5),
            expected_dailies: this.$persist(3),
            expected_daily_matches: this.$persist(5),
            expected_match_xp: this.$persist(500),

            //reset
            reset() {
                this.current_tier = 1;
                this.current_tier_xp = 0;
                this.expected_weeklies = 8;
                this.expected_play_days = 5;
                this.expected_dailies = 3;
                this.expected_daily_matches = 5;
                this.expected_match_xp = 500;
            },

            //season
            seasonStart() {
                return new Date('2022-10-04');
            },
            seasonEnd() {
                return new Date('2022-12-06');
            },
            daysLeft() {
                return (this.seasonEnd() - new Date()) / 86400000;
            },

            //current progress
            currentDay() {
                return (new Date() - this.seasonStart()) / 86400000;
            },
            currentTier() {
                return parseInt(this.current_tier || 0);
            },
            currentCompletedTier() {
                return Math.max(this.currentTier() - 1, 0);
            },
            currentTierXp() {
                return parseInt(this.current_tier_xp || 0);
            },
            currentXp() {
                return (this.currentCompletedTier() * 10000) + this.currentTierXp();
            },
            currentPercent() {
                return (this.currentCompletedTier() / 80) * 100;
            },

            //remaining
            remainingDays() {
                return (this.seasonEnd() - new Date()) / 86400000;
            },
            remainingTiers() {
                return 80 - this.currentCompletedTier();
            },
            remainingXp() {
                return (80 * 10000) - this.currentXp();
            },
            remainingPercent() {
                return (this.remainingTiers() / 80) * 100;
            },

            //minimum daily
            minimumDailyTiers() {
                return this.remainingTiers() / this.remainingDays();
            },
            minimumDailyXp() {
                return this.remainingXp() / this.remainingDays();
            },
            minimumDailyPercent() {
                return this.remainingPercent() / this.remainingDays();
            },

            //minimum weekly
            minimumWeeklyTiers() {
                return this.minimumDailyTiers() * 7;
            },
            minimumWeeklyXp() {
                return this.minimumDailyXp() * 7;
            },
            minimumWeeklyPercent() {
                return this.minimumDailyPercent() * 7;
            },

            //projected daily earn rate
            projectedDailyTiers() {
                return this.currentCompletedTier() / this.currentDay();
            },
            projectedDailyXp() {
                return this.currentXp() / this.currentDay();
            },
            projectedDailyPercent() {
                return this.currentPercent() / this.currentDay();
            },

            //projected weekly earn rate
            projectedWeeklyTiers() {
                return this.projectedDailyTiers() * 7;
            },
            projectedWeeklyXp() {
                return this.projectedDailyXp() * 7;
            },
            projectedWeeklyPercent() {
                return this.projectedDailyPercent() * 7;
            },

            //projected finish
            projectedWillFinish() {
                return this.projectedTiers() >= 80;
            },
            projectedDays() {
                return 800000 / this.projectedDailyXp();
            },
            projectedSpareDays() {
                let need = 800000 - this.currentXp();
                let projecting = this.projectedDailyXp() * this.remainingDays();
                let extra = projecting - need;
                return extra / this.projectedDailyXp();
            },
            projectedTiers() {
                let expecting = this.currentXp() + (this.projectedDailyXp() * this.remainingDays());
                return expecting / 10000;
            },

            //projected prestige
            projectedWillPrestige() {
                return this.projectedTiers() > 80;
            },
            projectedPrestigeDays() {
            },
            projectedPrestigeSpareDays() {
            },
            projectedPrestigeTiers() {
                let have = this.currentXp();
                let projecting = this.projectedDailyXp() * this.remainingDays();
                let total = have + projecting;
                return Math.min((total / 10000) - 80, 120);
            },
            projectedPrestigeTitles() {
                let extraTiers = this.projectedPrestigeTiers();
                return this.titlesFromTiers(extraTiers + 80);
            },

            //projected fail
            projectedWillFail() {
                return this.projectedTiers() < 80;
            },
            projectedSpareTiers() {
                return 80 - this.projectedTiers();
            },
            projectedSpareTiersCoins() {
                return this.projectedSpareTiers().$ceil() * 200;
            },
            projectedSpareTiersDollars() {
                return this.projectedSpareTiersCoins() / 100;
            },

            //expected daily earn rate
            expectedDailyMatches() {
                return parseInt(this.expected_daily_matches || 0);
            },
            expectedMatchXp() {
                return parseInt(this.expected_match_xp || 0);
            },
            expectedPlayDays() {
                return parseInt(this.expected_play_days || 0);
            },
            expectedDailies() {
                return parseInt(this.expected_dailies || 0);
            },
            expectedDailyDailiesXp() {
                let dailyXp = 0;

                if (this.expectedDailies() >= 3) dailyXp = 9000;
                else if (this.expectedDailies() >= 2) dailyXp = 6000;
                else if (this.expectedDailies() >= 1) dailyXp = 3000;
                else return 0;

                return (dailyXp * this.expectedPlayDays()) / 7;
            },
            expectedWeeklies() {
                return parseInt(this.expected_weeklies || 0);
            },
            expectedDailyWeekliesXp() {
                return (this.expectedWeeklies() * 5000) / 7;
            },
            expectedDailyTiers() {
                return this.expectedDailyXp() / 10000;
            },
            expectedDailyMatchXp() {
                return ((this.expectedDailyMatches() * this.expectedMatchXp()) * this.expectedPlayDays()) / 7;
            },
            expectedDailyXp() {
                return this.expectedDailyMatchXp() + this.expectedDailyDailiesXp() + this.expectedDailyWeekliesXp();
            },
            expectedXp() {
                return this.expectedDailyXp() * this.remainingDays();
            },
            expectedDailyPercent() {
                return (this.expectedDailyXp() / 800000) * 100;
            },

            //expected weekly earn rate
            expectedWeeklyTiers() {
                return this.expectedDailyTiers() * 7;
            },
            expectedWeeklyXp() {
                return this.expectedDailyXp() * 7;
            },
            expectedWeeklyPercent() {
                return this.expectedDailyPercent() * 7;
            },

            //expected finish
            expectedWillFinish() {
                return this.expectedTiers() >= 80;
            },
            expectedDays() {
                return 800000 / this.expectedDailyXp();
            },
            expectedSpareDays() {
                let required = 80 * 10000;
                let have = this.currentXp();
                let need = required - have;
                let expecting = this.expectedXp();
                let extra = expecting - need;
                return extra / this.expectedDailyXp();
            },
            expectedTiers() {
                let expecting = this.currentXp() + this.expectedXp();
                return Math.floor(expecting / 10000);
            },

            //expected prestige
            expectedWillPrestige() {
                return this.expectedTiers() > 80;
            },
            expectedPrestigeTiers() {
                let have = this.currentXp();
                let expecting = this.expectedXp();
                let total = have + expecting;
                return Math.min(Math.floor(total / 10000) - 80, 200 - 80);
            },
            expectedPrestigeTitles() {
                let extraTiers = this.expectedPrestigeTiers();
                return this.titlesFromTiers(extraTiers + 80);
            },

            //expected fail
            expectedWillFail() {
                return this.expectedTiers() < 80;
            },
            expectedSpareTiers() {
                let required = 80 * 10000;
                let have = this.currentXp();
                let need = required - have;
                let expecting = this.expectedXp();
                let missing = need - expecting;
                return Math.ceil(missing / 10000);
            },
            expectedSpareTiersCoins() {
                return this.expectedSpareTiers() * 200;
            },
            expectedSpareTiersUsd() {
                return this.expectedSpareTiersCoins() / 100;
            },

            //coins rate
            expectedDailyCoins() {
                return this.expectedWeeklyCoins() / 7;
            },
            expectedWeeklyCoins() {
                return this.coinsFromWeeklies(this.expectedWeeklies());
            },
            expectedSeasonalCoins() {
                return this.expectedWeeklyCoins() * 9;
            },
            expectedCoins() {
                return this.remainingDays() * this.expectedDailyCoins();
            },
            expectedBattlePassDays() {
                return 1000 / this.expectedDailyCoins();
            },
            expectedLegendaryDays() {
                return 2000 / this.expectedDailyCoins();
            },

            titlesFromTiers(tiers) {
                if (tiers >= 200) return 8;
                else if (tiers >= 175) return 7;
                else if (tiers >= 155) return 6;
                else if (tiers >= 135) return 5;
                else if (tiers >= 120) return 4;
                else if (tiers >= 105) return 3;
                else if (tiers >= 95) return 2;
                else if (tiers >= 85) return 1;
                else return 0;
            },

            coinsFromWeeklies(weeklies) {
                if (weeklies >= 11) return 60;
                else if (weeklies >= 8) return 50;
                else if (weeklies >= 4) return 30;
                else return 0;
            }
        }
    })
})