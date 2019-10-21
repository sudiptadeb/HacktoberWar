<template>
	<div class="main-content flex flex-grow">
		<div class="background"></div>
		<div class="center-box flex-grow layout-align-center-center layout-column">
			<div class="scoreboard layout-column layout-align-start-strech">
				<div class="sb-heading">
					WAR
				</div>
				<div class="sb-list layout-row layout-align-space-between-start">
					<div class="red-list">
						<div class="team-box" v-for="team in rteams">
							<div class="points">{{team.score}}</div>
							<div class="team-name">{{tema.name}}</div>
						</div>
					</div>
					<div class="blue-list">
						<div class="team-box" v-for="team in bteams">
							<div class="points">{{team.score}}</div>
							<div class="team-name">{{tema.name}}</div>
						</div>
					</div>
				</div>
				<div class="sb-footer">
					
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from "axios";
    export default {
        name: "ScoreBoard",
        data() {
            return {
                rteams: [],
                bteams: [],
                isLoading: false,
                errorOccurred: false,
                errorReason: null
            }
        },
        created() {
            this.getAllDetails();
        },
        methods: {
            getAllDetails() {
                this.getDetails();
            },
            getDetails() {
                this.isLoading = true;
                this.errorOccurred = false;
                let self = this;
                axios.get('api/v1/device')
                    .then(response => {
                        self.rteams = response.data.rteams;
                        self.bteams = response.data.bteams;
                    })
                    .catch(reason => {
                        self.errorReason = reason;
                        self.errorOccurred = true;
                    })
                    .finally(function () {
                        self.isLoading = false;
                    });
            }
        }
        
    }
</script>

<style>
@import "../assets/css/scoreboard.css";
</style>