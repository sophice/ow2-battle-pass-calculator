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

if (!Number.prototype.$min) {
    Number.prototype.$min = function (limit) {
        if (limit < this) return limit;
        return this;
    };
}

if (!Number.prototype.$max) {
    Number.prototype.$max = function (limit) {
        if (limit > this) return limit;
        return this;
    };
}

if (!Number.prototype.$highest) {
    Number.prototype.$highest = function (limit) {
        return this.$min(limit);
    };
}

if (!Number.prototype.$lowest) {
    Number.prototype.$lowest = function (limit) {
        return this.$max(limit);
    };
}

if (!Number.prototype.$limit) {
    Number.prototype.$limit = function (minimum, maximum) {
        if (minimum !== null && this < minimum) return minimum;
        if (maximum !== null && this > maximum) return maximum;
        return this;
    };
}

document.addEventListener('alpine:init', () => {
    Alpine.data('app', function () {
        return {
            //inputs
            current_tier: this.$persist(1),
            current_tier_xp: this.$persist(0),
            expected_play_days: this.$persist(5),
            expected_dailies: this.$persist(3),
            expected_daily_matches: this.$persist(5),
            expected_match_xp: this.$persist(500),
            expected_weeklies: this.$persist(8),
            tab: this.$persist('all'),

            init() {
                if (window.location.hash) {
                    const params = new URLSearchParams(window.location.hash.substring(1));
                    if (params.has('t')) this.current_tier = params.get('t');
                    if (params.has('x')) this.current_tier_xp = params.get('x');
                    if (params.has('p')) this.expected_play_days = params.get('p');
                    if (params.has('d')) this.expected_dailies = params.get('d');
                    if (params.has('m')) this.expected_daily_matches = params.get('m');
                    if (params.has('v')) this.expected_match_xp = params.get('v');
                    if (params.has('w')) this.expected_weeklies = params.get('w');
                }
            },

            //buttons
            share() {
                const params = new URLSearchParams();
                params.set('t', this.currentTier());
                params.set('x', this.currentTierXp());
                params.set('p', this.expectedPlayDays());
                params.set('d', this.expectedDailies());
                params.set('m', this.expectedDailyMatches());
                params.set('v', this.expectedMatchXp());
                params.set('w', this.expectedWeeklies());
                let link = window.location.toString();
                link = link.substring(0, link.length - window.location.hash.length);
                link = link + '#' + params;
                window.prompt('Here is your link!', link);
            },
            reset() {
                this.current_tier = 1;
                this.current_tier_xp = 0;
                this.expected_weeklies = 8;
                this.expected_play_days = 5;
                this.expected_dailies = 3;
                this.expected_daily_matches = 5;
                this.expected_match_xp = 500;
            },

            //tabs
            currentTab() {
                return this.tab;
            },
            tabSelected(...tabs) {
                for (const tab of tabs) {
                    if (tab === this.currentTab()) return true;
                }
                return false;
            },
            selectTab(tab) {
                this.tab = tab;

                //not sure i like this, it might confuse people that don't realize it's on, leaving it disabled for now
                //window.location.hash = this.tab;
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
                let result = parseInt(this.current_tier || 0);
                if (result < 1) return 1;
                if (result > 200) return 200;
                return result;
            },
            currentCompletedTier() {
                if (this.currentTier() > 200) return 200;
                else if (this.currentTier() === 200 && this.currentTierXp() >= 250000) return 200;
                else if (this.currentTier() > 175) return 175;
                else if (this.currentTier() > 155) return 155;
                else if (this.currentTier() > 135) return 135;
                else if (this.currentTier() > 120) return 120;
                else if (this.currentTier() > 105) return 105;
                else if (this.currentTier() > 95) return 95;
                else if (this.currentTier() > 85) return 85;
                else if (this.currentTier() > 80) return 80;

                return Math.max(this.currentTier() - 1, 0);
            },
            currentCompletedPrestigeTier() {
                return Math.max(this.currentCompletedTier() - 80, 0);
            },
            currentTierXp() {
                if (this.current_tier_xp < 0) return 0;
                return parseInt(this.current_tier_xp || 0);
            },
            currentXp() {
                return (this.currentCompletedTier() * 10000) + this.currentTierXp();
            },
            currentPrestigeXp() {
                return Math.max(this.currentXp() - 800000, 0);
            },
            currentMissingXp() {
                return Math.max(800000 - this.currentXp(), 0);
            },
            currentMissingPrestigeXp() {
                return Math.max(2000000 - this.currentXp(), 0);
            },
            currentPercent() {
                return Math.min(this.currentXp() / 800000, 1) * 100;
            },
            currentPercentBar() {
                let current = Math.min(this.currentXp(), 800000);
                return Math.min(current / 2000000, 1) * 100;
            },
            currentPrestigePercent() {
                return Math.min((this.currentXp() - 800000) / 1200000, 1) * 100;
            },
            currentPrestigePercentBar() {
                return Math.min((this.currentXp() - 800000) / 2000000, 1) * 100;
            },

            //remaining
            remainingDays() {
                return Math.max((this.seasonEnd() - new Date()) / 86400000, 0);
            },
            remainingTiers() {
                return 80 - this.currentCompletedTier();
            },
            remainingPrestigeTiers() {
                if (this.currentCompletedTier() === 199 && this.currentTierXp() >= 10000) return 0;
                return 200 - this.currentCompletedTier();
            },
            remainingXp() {
                return (80 * 10000) - this.currentXp();
            },
            remainingPrestigeXp() {
                return (200 * 10000) - this.currentXp();
            },
            remainingPercent() {
                return (this.remainingTiers() / 80) * 100;
            },
            remainingPrestigePercent() {
                return (this.remainingPrestigeTiers() / 200) * 100;
            },

            //minimum daily
            minimumDailyTiers() {
                return Math.max(this.remainingTiers() / this.remainingDays(), 0);
            },
            minimumDailyXp() {
                return Math.max(this.remainingXp() / this.remainingDays(), 0);
            },
            minimumDailyPercent() {
                return Math.max(this.remainingPercent() / this.remainingDays(), 0);
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

            //minimum daily for prestige
            minimumDailyPrestigeTiers() {
                return this.remainingPrestigeTiers() / this.remainingDays();
            },
            minimumDailyPrestigeXp() {
                return this.remainingPrestigeXp() / this.remainingDays();
            },
            minimumDailyPrestigePercent() {
                return this.remainingPrestigePercent() / this.remainingDays();
            },

            //minimum weekly for prestige
            minimumWeeklyPrestigeTiers() {
                return this.minimumDailyPrestigeTiers() * 7;
            },
            minimumWeeklyPrestigeXp() {
                return this.minimumDailyPrestigeXp() * 7;
            },
            minimumWeeklyPrestigePercent() {
                return this.minimumDailyPrestigePercent() * 7;
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
            projectedXp() {
                return this.projectedDailyXp() * this.remainingDays();
            },
            projectedDays() {
                let result = (800000 / this.projectedDailyXp()) - this.currentDay();
                if (result < 0) return 0;
                return result;
            },
            projectedSpareDays() {
                return 63 - (this.currentDay() + this.projectedDays());
            },
            projectedTiers() {
                let expecting = this.currentXp() + (this.projectedDailyXp() * this.remainingDays());
                let result = expecting / 10000;
                if (result < 0) return 0;
                if (result > 200) return 200;
                return result;
            },
            projectedPercent() {
                return (Math.min(this.projectedTiers(), 80) / 80) * 100;
            },
            projectedPercentBar() {
                return (Math.min(this.projectedTiers(), 80) / 200) * 100;
            },
            projectedPrestigePercent() {
                return (this.projectedPrestigeTiers() / 120) * 100;
            },
            projectedPrestigePercentBar() {
                return (this.projectedPrestigeTiers() / 200) * 100;
            },

            //projected prestige
            projectedWillPrestige() {
                return this.projectedTiers() > 80;
            },
            projectedWillFinishPrestige() {
                return this.projectedPrestigeTiers() >= 120;
            },
            projectedPrestigeDays() {
                return (63 - this.projectedPrestigeSpareDays()) - this.currentDay();
            },
            projectedPrestigeSpareDays() {
                let extra = this.projectedXp() - (2000000 - this.currentXp());
                return Math.min(extra / this.projectedDailyXp(), 7 * 9);
            },
            projectedPrestigeTiers() {
                let have = this.currentXp();
                let projecting = this.projectedDailyXp() * this.remainingDays();
                let total = have + projecting;
                return Math.min((total / 10000) - 80, 120);
            },
            projectedPrestigeTiersMissed() {
                return 120 - this.projectedPrestigeTiers();
            },
            projectedPrestigeTitles() {
                let extraTiers = this.projectedPrestigeTiers();
                return this.titlesFromTiers(extraTiers + 80);
            },
            projectedPrestigeTitlesMissed() {
                return 8 - this.projectedPrestigeTitles();
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
                return Math.max((this.currentMissingXp() / this.expectedDailyXp()) - this.currentDay(), 0);
            },
            expectedSpareDays() {
                return 63 - (this.currentDay() + this.expectedDays());
            },
            expectedTiers() {
                let expecting = this.currentXp() + this.expectedXp();
                let result = Math.floor(expecting / 10000);
                if (result < 0) return 0;
                if (result > 200) return 200;
                return result;
            },
            expectedPercent() {
                return (Math.min(this.expectedTiers(), 80) / 80) * 100;
            },
            expectedPercentBar() {
                return (Math.min(this.expectedTiers(), 80) / 200) * 100;
            },
            expectedPrestigePercent() {
                return (this.expectedPrestigeTiers() / 120) * 100;
            },
            expectedPrestigePercentBar() {
                return (this.expectedPrestigeTiers() / 200) * 100;
            },

            //expected prestige
            expectedWillPrestige() {
                return this.expectedTiers() > 80;
            },
            expectedWillFinishPrestige() {
                return this.expectedPrestigeTiers() >= 120;
            },
            expectedPrestigeDays() {
                return (63 - this.expectedPrestigeSpareDays()) - this.currentDay();
            },
            expectedPrestigeSpareDays() {
                let extra = this.expectedXp() - (2000000 - this.currentXp());
                return Math.min(extra / this.expectedDailyXp(), 7 * 9);
            },
            expectedPrestigeTiers() {
                let have = this.currentXp();
                let expecting = this.expectedXp();
                let total = have + expecting;
                return Math.min(Math.floor(total / 10000) - 80, 200 - 80);
            },
            expectedPrestigeTiersMissed() {
                return 120 - this.expectedPrestigeTiers();
            },
            expectedPrestigeTitles() {
                let extraTiers = this.expectedPrestigeTiers();
                return this.titlesFromTiers(extraTiers + 80);
            },
            expectedPrestigeTitlesMissed() {
                return 8 - this.expectedPrestigeTitles();
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