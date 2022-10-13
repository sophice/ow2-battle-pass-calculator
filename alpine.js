document.addEventListener('alpine:init', () => {
    Alpine.data('overwatch', () => ({
        //inputs
        current_tier: 1,
        current_tier_xp: 0,
        expected_weeklies: 8,
        expected_play_days: 5,
        expected_dailies: 3,
        expected_daily_matches: 5,
        expected_match_xp: 500,

        //season

        seasonStart() {
            return new Date('2022-10-04');
        },
        seasonEnd() {
            return new Date('2022-12-06');
        },
        daysLeft() {
            return Math.floor((this.seasonEnd() - new Date()) / 86400000);
        },

        currentDay() {
            return Math.floor((new Date() - this.seasonStart()) / 86400000);
        },
        currentTier() {
            return this.current_tier;
        },
        currentCompletedTier() {
            return Math.max(this.currentTier() - 1, 0);
        },
        currentTierXp() {
            return this.current_tier_xp;
        },
        currentXp() {
            return (this.currentCompletedTier() * 10000) + this.currentTierXp();
        },
        currentPercent() {
            return (this.currentCompletedTier() / 80) * 100;
        },

        //remaining
        remaining_days: '',
        remaining_tiers: '',
        remaining_xp: '',
        remaining_percent: '',

        //minimum daily
        daily_goal_tiers: '',
        daily_goal_xp: '',
        daily_goal_percent: '',

        //minimum weekly
        weekly_goal_tiers: '',
        weekly_goal_xp: '',
        weekly_goal_percent: '',

        //projected daily earn rate
        daily_average_tiers: '',
        daily_average_xp: '',
        daily_average_percent: '',

        //projected weekly earn rate
        weekly_average_tiers: '',
        weekly_average_xp: '',
        weekly_average_percent: '',

        //projected finish
        projected_will_finish: false,
        projected_spare_days: '',
        projected_tiers: '',

        //projected prestige
        projected_will_prestige: false,
        projected_prestige_tiers: '',
        projected_prestige_titles: '',

        //projected fail
        projected_will_fail: '',
        projected_spare_tiers: '',
        projected_spare_tiers_cost: '',
        projected_spare_tiers_cost_usd: '',

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

        test() {
            return this.current_tier || 0;
        },

        onInput() {
        },

        toggle() {
            this.open = !this.open
        },
    }))
})