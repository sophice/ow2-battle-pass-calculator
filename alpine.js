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
                return parseInt(this.current_tier);
            },
            currentCompletedTier() {
                return Math.max(this.currentTier() - 1, 0);
            },
            currentTierXp() {
                return parseInt(this.current_tier_xp);
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
            },
            projectedSpareTiers() {
            },
            projectedSpareTiersCoins() {
            },
            projectedSpareTiersDollars() {
            },

            //expected daily earn rate
            expected_daily_tiers: '',
            expected_daily_xp: '',
            expected_daily_percent: '',

            //expected weekly earn rate
            expected_weekly_tiers: '',
            expected_weekly_xp: '',
            expected_weekly_percent: '',

            //expected finish
            expected_will_finish: false,
            expected_spare_days: '',
            expected_tiers: '',

            //expected prestige
            expected_will_prestige: false,
            expected_prestige_tiers: '',
            expected_prestige_titles: '',

            //expected fail
            expected_will_fail: false,
            expected_spare_tiers: '',
            expected_spare_tiers_cost: '',
            expected_spare_tiers_cost_usd: '',

            //coins rate
            days_per_battle_pass: '',
            days_per_legendary: '',

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
        }
    })
})