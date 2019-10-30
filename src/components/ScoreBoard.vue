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
							<div class="points">{{team.points}}</div>
							<div class="team-name">{{team.name}}</div>
						</div>
					</transition-group>
					<transition-group name="flip-list" tag="ul" class="blue-list">
						<div class="team-box" v-for="team in blueTeams" v-bind:key="team.name">
							<div class="points">{{team.points}}</div>
							<div class="team-name">{{team.name}}</div>
						</div>
					</transition-group>
				</div>
				<div class="sb-footer">
					Footer
				</div>
			</div>
		</div>
	</div>
</template>

<script>
    import {shuffle} from "lodash";

    export default {
        name: "ScoreBoard",
        data() {
            return {
                loaded: false,
                shuffle: null,
                redTeams: [
                    {name: "Debug Thugs", points: 120},
                    {name: "Verithanam Hackers", points: 100},
                    {name: "Shadowkhan", points: 90},
                    {name: "Fun Panrom", points: 80},
                    {name: "Irakamatravargal", points: 70},
                    {name: "HeartHackers", points: 70},
                    {name: "Cliq Geeks", points: 70},
                    {name: "I.E.U.P.", points: 70},
                    {name: "CLIQ-GEEK", points: 70},
                    {name: "SitesCyber", points: 70},
                    {name: "CodeProject", points: 120},
                    {name: "Searching...", points: 100},
                    {name: "Christopher", points: 90},
                    {name: "venom", points: 80},
                    {name: "Virus", points: 70},
                    {name: "Avengers", points: 70},
                    {name: "SPARKS", points: 70},
                    {name: "Zyber Punks", points: 70},
                    {name: "I do not know", points: 70},
                    {name: "Mostwanted", points: 70},
                    {name: "Anonymous", points: 80},
                    {name: "Firewall ", points: 70},
                    {name: "Mavericks", points: 70},
                    {name: "CyberWarriors", points: 70},
                    {name: "vadawow", points: 70},
                    {name: "Team Soona Paana", points: 70}
                ],
                blueTeams: [
                    {name: "Debug Thugs", points: 120},
                    {name: "Verithanam Hackers", points: 100},
                    {name: "Shadowkhan", points: 90},
                    {name: "Fun Panrom", points: 80},
                    {name: "Irakamatravargal", points: 70},
                    {name: "HeartHackers", points: 70},
                    {name: "Cliq Geeks", points: 70},
                    {name: "I.E.U.P.", points: 70},
                    {name: "CLIQ-GEEK", points: 70},
                    {name: "SitesCyber", points: 70},
                    {name: "CodeProject", points: 120},
                    {name: "Searching...", points: 100},
                    {name: "Christopher", points: 90},
                    {name: "venom", points: 80},
                    {name: "Virus", points: 70},
                    {name: "Avengers", points: 70},
                    {name: "SPARKS", points: 70},
                    {name: "Zyber Punks", points: 70},
                    {name: "I do not know", points: 70},
                    {name: "Mostwanted", points: 70},
                    {name: "Anonymous", points: 80},
                    {name: "Firewall ", points: 70},
                    {name: "Mavericks", points: 70},
                    {name: "CyberWarriors", points: 70},
                    {name: "vadawow", points: 70},
                    {name: "Team Soona Paana", points: 70}
                ]
            }
        },
        created() {
            setTimeout(function () {
                this.loaded = true;
            }.bind(this), 1);

            this.shuffle = setInterval(function () {
                this.redTeams = shuffle(this.redTeams);
                this.blueTeams = shuffle(this.blueTeams);
            }.bind(this), 5000);
        }
    }
</script>

<style>
	@import "../assets/css/scoreboard.css";

	.flip-list-move {
		transition: transform 1s;
	}
</style>