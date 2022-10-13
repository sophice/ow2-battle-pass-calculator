class App {
    static inputs = {
        current_tier: 1,
        current_tier_xp: 0,
        expected_weeklies: 8,
        expected_play_days: 5,
        expected_dailies: 3,
        expected_daily_matches: 3,
        expected_match_xp: 500
    };

    //start the app up
    static start() {
        this.loadOverwatch();
        this.updateInputs();
        this.updateOutputs();
    }

    //reset the app
    static reset() {
        for (let [key, fallback] of Object.entries(this.inputs)) {
            localStorage.setItem(key, fallback.toString());
        }
        this.start();
    }

    //when an input changes
    static onInput() {
        this.updateOverwatch();
        this.updateOutputs();
        this.saveOverwatch();
    }

    //load values from storage to Overwatch
    static loadOverwatch() {
        for (let [key, fallback] of Object.entries(this.inputs)) {
            let value = localStorage.getItem(key.toString());
            if (value === null) Overwatch[key] = fallback;
            else Overwatch[key] = value;
        }
    }

    //copy values from inputs to Overwatch
    static updateOverwatch() {
        for (let [key, fallback] of Object.entries(this.inputs)) {
            let value = parseInt(document.getElementsByName(key)[0].value);
            if (value === null || isNaN(value)) value = fallback;
            console.log('setting Overwatch.' + key + ' = ' + value);
            Overwatch[key] = value;
            console.log('confirming Overwatch.' + key + ' = ' + Overwatch[key]);
        }
    }

    //save values from Overwatch to storage
    static saveOverwatch() {
        for (let [key, fallback] of Object.entries(this.inputs)) {
            let value = Overwatch[key].toString();
            if (value === null) value = fallback.toString();
            localStorage.setItem(key, value);
        }
    }

    //copy values from Overwatch to inputs
    static updateInputs() {
        for (let [key, fallback] of Object.entries(this.inputs)) {
            let value = Overwatch[key].toString();
            if (value === null) value = fallback.toString();
            document.getElementsByName(key.toString())[0].value = value;
        }
    }

    static updateOutputs() {
        //progress
        document.getElementById('progress_days').innerText = new Intl.NumberFormat(undefined, {maximumFractionDigits: 0}).format(Overwatch.currentDay()) + ' days';
        document.getElementById('progress_tiers').innerText = new Intl.NumberFormat(undefined, {maximumFractionDigits: 2}).format(Overwatch.currentCompletedTier()) + ' tiers';
        document.getElementById('progress_xp').innerText = new Intl.NumberFormat(undefined, {maximumFractionDigits: 0}).format(Overwatch.currentXp()) + ' XP';
        document.getElementById('progress_percent').innerText = new Intl.NumberFormat(undefined, {maximumFractionDigits: 2}).format(Overwatch.currentPercent()) + '%';

        //remaining
        document.getElementById('remaining_days').innerText = new Intl.NumberFormat(undefined, {maximumFractionDigits: 0}).format(Overwatch.remainingDays()) + ' days';
        document.getElementById('remaining_tiers').innerText = new Intl.NumberFormat(undefined, {maximumFractionDigits: 2}).format(Overwatch.remainingTiers()) + ' tiers';
        document.getElementById('remaining_xp').innerText = new Intl.NumberFormat(undefined, {maximumFractionDigits: 0}).format(Overwatch.remainingXp()) + ' XP';
        document.getElementById('remaining_percent').innerText = new Intl.NumberFormat(undefined, {maximumFractionDigits: 2}).format(Overwatch.remainingPercent()) + '%';

        //daily averages
        document.getElementById('daily_average_tiers').innerText = new Intl.NumberFormat(undefined, {maximumFractionDigits: 2}).format(Overwatch.dailyAverageTiers()) + ' tiers';
        document.getElementById('daily_average_xp').innerText = new Intl.NumberFormat(undefined, {maximumFractionDigits: 0}).format(Overwatch.dailyAverageXp()) + ' XP';
        document.getElementById('daily_average_percent').innerText = new Intl.NumberFormat(undefined, {maximumFractionDigits: 2}).format(Overwatch.dailyAveragePercent()) + '%';

        //weekly averages
        document.getElementById('weekly_average_tiers').innerText = new Intl.NumberFormat(undefined, {maximumFractionDigits: 2}).format(Overwatch.weeklyAverageTiers()) + ' tiers';
        document.getElementById('weekly_average_xp').innerText = new Intl.NumberFormat(undefined, {maximumFractionDigits: 0}).format(Overwatch.weeklyAverageXp()) + ' XP';
        document.getElementById('weekly_average_percent').innerText = new Intl.NumberFormat(undefined, {maximumFractionDigits: 2}).format(Overwatch.weeklyAveragePercent()) + '%';

        //daily goals
        document.getElementById('daily_goal_tiers').innerText = new Intl.NumberFormat(undefined, {maximumFractionDigits: 2}).format(Overwatch.dailyGoalTiers()) + ' tiers';
        document.getElementById('daily_goal_xp').innerText = new Intl.NumberFormat(undefined, {maximumFractionDigits: 0}).format(Overwatch.dailyGoalXp()) + ' XP';
        document.getElementById('daily_goal_percent').innerText = new Intl.NumberFormat(undefined, {maximumFractionDigits: 2}).format(Overwatch.dailyGoalPercent()) + '%';

        //weekly goals
        document.getElementById('weekly_goal_tiers').innerText = new Intl.NumberFormat(undefined, {maximumFractionDigits: 2}).format(Overwatch.weeklyGoalTiers()) + ' tiers';
        document.getElementById('weekly_goal_xp').innerText = new Intl.NumberFormat(undefined, {maximumFractionDigits: 0}).format(Overwatch.weeklyGoalXp()) + ' XP';
        document.getElementById('weekly_goal_percent').innerText = new Intl.NumberFormat(undefined, {maximumFractionDigits: 2}).format(Overwatch.weeklyGoalPercent()) + '%';

        //expected daily gains
        document.getElementById('expected_daily_tiers').innerText = new Intl.NumberFormat(undefined, {maximumFractionDigits: 2}).format(Overwatch.expectedDailyTiers()) + ' tiers';
        document.getElementById('expected_daily_xp').innerText = new Intl.NumberFormat(undefined, {maximumFractionDigits: 0}).format(Overwatch.expectedDailyXp()) + ' XP';
        document.getElementById('expected_daily_percent').innerText = new Intl.NumberFormat(undefined, {maximumFractionDigits: 2}).format(Overwatch.expectedDailyPercent()) + '%';

        //expected daily gains
        document.getElementById('expected_weekly_tiers').innerText = new Intl.NumberFormat(undefined, {maximumFractionDigits: 2}).format(Overwatch.expectedWeeklyTiers()) + ' tiers';
        document.getElementById('expected_weekly_xp').innerText = new Intl.NumberFormat(undefined, {maximumFractionDigits: 0}).format(Overwatch.expectedWeeklyXp()) + ' XP';
        document.getElementById('expected_weekly_percent').innerText = new Intl.NumberFormat(undefined, {maximumFractionDigits: 2}).format(Overwatch.expectedWeeklyPercent()) + '%';

        //projected completion
        document.getElementById('prompt_projected_finish').style.display = 'none';
        document.getElementById('prompt_projected_prestige_tiers').style.display = 'none';
        document.getElementById('prompt_projected_spare_tiers').style.display = 'none';
        if (Overwatch.projectedSpareDays() >= 0) {
            document.getElementById('projected_spare_days').innerText = new Intl.NumberFormat(undefined, {maximumFractionDigits: 0}).format(Math.floor(Overwatch.projectedSpareDays())) + ' days';
            document.getElementById('prompt_projected_finish').style.display = 'inline';
            if (Overwatch.projectedPrestigeTiers() >= 0) {
                document.getElementById('projected_prestige_tiers').innerText = new Intl.NumberFormat(undefined, {maximumFractionDigits: 0}).format(Math.floor(Overwatch.projectedPrestigeTiers())) + ' prestige tiers';
                document.getElementById('projected_prestige_titles').innerText = new Intl.NumberFormat(undefined, {maximumFractionDigits: 0}).format(Math.floor(Overwatch.projectedPrestigeTierTitles())) + ' prestige titles';
                document.getElementById('prompt_projected_prestige_tiers').style.display = 'inline';
            }
        } else {
            document.getElementById('projected_spare_tiers').innerText = new Intl.NumberFormat(undefined, {maximumFractionDigits: 0}).format(Math.ceil(Overwatch.projectedSpareTiers())) + ' tiers';
            document.getElementById('projected_spare_tiers_cost').innerText = new Intl.NumberFormat(undefined, {maximumFractionDigits: 0}).format(Math.ceil(Overwatch.projectedSpareTiersCost())) + ' coins';
            document.getElementById('projected_spare_tiers_cost_usd').innerText = '$' + new Intl.NumberFormat(undefined, {maximumFractionDigits: 2}).format(Overwatch.projectedSpareTiersCostUsd()) + ' USD';
            document.getElementById('prompt_projected_spare_tiers').style.display = 'inline';
        }

        //expected completion
        document.getElementById('prompt_expected_finish').style.display = 'none';
        document.getElementById('prompt_expected_prestige_tiers').style.display = 'none';
        document.getElementById('prompt_expected_spare_tiers').style.display = 'none';
        if (Overwatch.expectedSpareDays() >= 0) {
            document.getElementById('expected_spare_days').innerText = new Intl.NumberFormat(undefined, {maximumFractionDigits: 0}).format(Math.floor(Overwatch.expectedSpareDays())) + ' days';
            document.getElementById('prompt_expected_finish').style.display = 'inline';
            if (Overwatch.expectedPrestigeTiers() >= 0) {
                document.getElementById('expected_prestige_tiers').innerText = new Intl.NumberFormat(undefined, {maximumFractionDigits: 0}).format(Math.floor(Overwatch.expectedPrestigeTiers())) + ' prestige tiers';
                document.getElementById('expected_prestige_titles').innerText = new Intl.NumberFormat(undefined, {maximumFractionDigits: 0}).format(Math.floor(Overwatch.expectedPrestigeTierTitles())) + ' prestige titles';
                document.getElementById('prompt_expected_prestige_tiers').style.display = 'inline';
            }
        } else {
            document.getElementById('expected_spare_tiers').innerText = new Intl.NumberFormat(undefined, {maximumFractionDigits: 0}).format(Math.ceil(Overwatch.expectedSpareTiers())) + ' tiers';
            document.getElementById('expected_spare_tiers_cost').innerText = new Intl.NumberFormat(undefined, {maximumFractionDigits: 0}).format(Math.ceil(Overwatch.expectedSpareTiersCost())) + ' coins';
            document.getElementById('expected_spare_tiers_cost_usd').innerText = '$' + new Intl.NumberFormat(undefined, {maximumFractionDigits: 2}).format(Overwatch.expectedSpareTiersCostUsd()) + ' USD';
            document.getElementById('prompt_expected_spare_tiers').style.display = 'inline';
        }

        //days per legendary
        document.getElementById('days_per_legendary').innerText = new Intl.NumberFormat(undefined, {maximumFractionDigits: 0}).format(Math.ceil(Overwatch.daysPerLegendary())) + ' days';
        document.getElementById('days_per_battle_pass').innerText = new Intl.NumberFormat(undefined, {maximumFractionDigits: 0}).format(Math.ceil(Overwatch.daysPerBattlePass())) + ' days';
    }
}