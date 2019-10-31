<template>
	<div class="main-content flex flex-grow" :class="{'loaded':loaded}">
		<div class="background" style="background: black"></div>
		<div class="background" id="bg-left"></div>
		<div class="background" id="bg-right"></div>
		<div class="background" id="war-txt"></div>
		<div class="center-box flex-grow layout-align-center-center layout-column">
			<div class="scoreboard layout-column layout-align-start-strech">
				<div class="sb-heading">
					<!--					WAR-->
					&nbsp;
				</div>
				<div class="sb-list layout-row layout-align-space-between-start">
					<transition-group name="flip-list" tag="ul" class="red-list">
						<div class="team-box" v-for="team in redTeams" v-bind:key="team.name">
							<div class="points">{{team.redScore}}</div>
							<div class="team-name">{{team.name}}</div>
						</div>
					</transition-group>
					<transition-group name="flip-list" tag="ul" class="blue-list">
						<div class="team-box" v-for="team in blueTeams" v-bind:key="team.name">
							<div class="points">{{team.blueScore}}</div>
							<div class="team-name">{{team.name}}</div>
						</div>
					</transition-group>
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
                loaded: false,
								conf :null,
								teams:null
            }
        },
			computed:{
				redTeams(){
					if(!this.teams){
						return []
					}
					let redScoreSorted = [...this.teams];
					redScoreSorted.sort((a, b) => (  b.redScore-a.redScore));
					return redScoreSorted;
				},
				blueTeams(){
					if(!this.teams){
						return []
					}
					let blueScoreSorted = [...this.teams];
					blueScoreSorted.sort((a, b) => ( b.blueScore-a.blueScore));
					return blueScoreSorted;
				}
			},
			mounted(){
        	let self = this;
					require(['../map/conf'],(data)=>{
						self.conf = data.conf;
						self.teams = data.teams.map(each=>({name:each.name,redScore:0,blueScore:0}))
						self.initMethod()
					})
			},
			methods:{
				initMethod(){
        		if(this.conf.production){
        			this.fetchStats();
						}else{
        			this.runForRandom();
						}
				},
				fetchStats() {
					axios.get(this.conf.statusUrl).then(res => {
						this.loaded =true;
						let data = res.data.Keyset_Stats;
						data.forEach(each => {
							let index = this.teams.findIndex(each => each.name === each.Team_name);
							if (index !== -1) {
								this.teams[index].redScore = each.RScore;
								this.teams[index].blueScore = each.BScore;
							}
						});
					});

					setTimeout(() => {
						this.fetchStats()
					}, this.conf.requestStatForEvery)
				},
				runForRandom() {
					for (let i = 0; i < this.teams.length; i++) {
						let team = this.teams[i];
						team.redScore = Math.ceil(Math.random() * this.teams.length) - 1;
						team.blueScore = Math.ceil(Math.random() * this.teams.length) - 1;
						this.loaded =true;
				}
					setTimeout(() => this.runForRandom(),  Math.random() * this.conf.randomTimeGap * 100);

				}
    }
		}
</script>

<style>
	@import "../assets/css/scoreboard.css";

	.flip-list-move {
		transition: transform 1s;
	}
</style>