<template>
	<div class="map-back flex layout-row layout-align-start-stretch overflow-auto">
		<img id="basemap" src="../assets/img/basemap.png" style="display: none" alt="" :width="width" :height="height">
		<div id="p5Canvas" :style="{position:'relative',top:panOffset.y+'px',left:panOffset.x+'px'}"></div>
	</div>
</template>

<script>
    import klean1 from '../assets/img/klean1.png';
    import klean2 from '../assets/img/klean2.png';
    import klean3 from '../assets/img/klean3.png';

    export default {
        name: "Map",
        data() {
            return {
                width: 7643 / 2,
                height: 3525 / 2,
                zoomScale: 1,
                panOffset: {x: 0, y: 0},
                panSpeed: 30,
                teams: [
                    {
                        "id": 0,
                        "name": "Debug Thugs",
                        location: {
                            x: 5956,
                            y: 1244
                        }
                    },
                    {
                        "id": 1,
                        "name": "Verithanam Hackers",
                        location: {
                            x: 3028,
                            y: 947
                        }
                    },
                    {
                        "id": 2,
                        "name": "Shadowkhan",
                        location: {
                            x: 5483,
                            y: 2674
                        }
                    },
                    {
                        "id": 3,
                        "name": "Fun Panrom",
                        location: {
                            x: 5875,
                            y: 2583
                        }
                    },
                    {
                        "id": 4,
                        "name": "Irakamatravargal",
                        location: {
                            x: 6003,
                            y: 1872
                        }
                    },
                    {
                        "id": 5,
                        "name": "HeartHackers",
                        location: {
                            x: 2972,
                            y: 2513
                        }
                    },
                    {
                        "id": 6,
                        "name": "Cliq Geeks",
                        location: {
                            x: 1630,
                            y: 2422
                        }
                    },
                    {
                        "id": 7,
                        "name": "Ithellam Enga urupada poguthu",
                        location: {
                            x: 5003,
                            y: 2401
                        }
                    },
                    {
                        "id": 8,
                        "name": "CLIQ-GEEK",
                        location: {
                            x: 6203,
                            y: 2891
                        }
                    },
                    {
                        "id": 9,
                        "name": "SitesCyber",
                        location: {
                            x: 2520,
                            y: 2531
                        }
                    },
                    {
                        "id": 10,
                        "name": "CodeProject",
                        location: {
                            x: 2479,
                            y: 1733
                        }
                    },
                    {
                        "id": 11,
                        "name": "Searching...",
                        location: {
                            x: 7148,
                            y: 2300
                        }
                    },
                    {
                        "id": 12,
                        "name": "Christopher",
                        location: {
                            x: 5366,
                            y: 636
                        }
                    },
                    {
                        "id": 13,
                        "name": "venom",
                        location: {
                            x: 2174,
                            y: 2326
                        }
                    },
                    {
                        "id": 14,
                        "name": "Virus",
                        location: {
                            x: 6632,
                            y: 1442
                        }
                    },
                    {
                        "id": 15,
                        "name": "Avengers",
                        location: {
                            x: 6236,
                            y: 497
                        }
                    },
                    {
                        "id": 16,
                        "name": "SPARKS",
                        location: {
                            x: 6495,
                            y: 1102
                        }
                    },
                    {
                        "id": 17,
                        "name": "Zyber Punks",
                        location: {
                            x: 4147,
                            y: 2216
                        }
                    },
                    {
                        "id": 18,
                        "name": "I do not know",
                        location: {
                            x: 998,
                            y: 1782
                        }
                    },
                    {
                        "id": 19,
                        "name": "Mostwanted",
                        location: {
                            x: 1838,
                            y: 547
                        }
                    },
                    {
                        "id": 20,
                        "name": "Anonymous",
                        location: {
                            x: 1829,
                            y: 1671
                        }
                    },
                    {
                        "id": 21,
                        "name": "Firewall ",
                        location: {
                            x: 1429,
                            y: 1303
                        }
                    },
                    {
                        "id": 22,
                        "name": "Mavericks",
                        location: {
                            x: 910,
                            y: 2123
                        }
                    },
                    {
                        "id": 23,
                        "name": "CyberWarriors",
                        location: {
                            x: 856,
                            y: 2752
                        }
                    },
                    {
                        "id": 24,
                        "name": "vadawow",
                        location: {
                            x: 2159,
                            y: 2891
                        }
                    },
                    {
                        "id": 25,
                        "name": "Team Soona Paana",
                        location: {
                            x: 669,
                            y: 775
                        }
                    }],

                attacks: [
                    this.randomAttack(11, 26, 1000),
                    this.randomAttack(12, 26, 1000)
                ]
            }
        },
        methods: {
            randomAttack: function (i, teams, attacks) {
                let randTeam = Math.ceil(Math.random() * (teams - 1));
                return [i, randTeam === i ? i : randTeam, Math.ceil(Math.random() * attacks)]
            }
        },
        created() {

            if (this.$route.query.zoomScale) {
                this.zoomScale = parseFloat(this.$route.query.zoomScale);
            }

            window.addEventListener('keydown', (e) => {

                if (e.key === '+') {
                    this.zoomScale += .01;
                }
                if (e.key === '-') {
                    this.zoomScale -= .01;
                }


                if (e.code === 'ArrowLeft') {
                    this.panOffset.x -= this.panSpeed;
                }
                if (e.code === 'ArrowRight') {
                    this.panOffset.x += this.panSpeed;
                }
                if (e.code === 'ArrowUp') {
                    this.panOffset.y -= this.panSpeed;
                }
                if (e.code === 'ArrowDown') {
                    this.panOffset.y += this.panSpeed;
                }

                this.$router.push({query: {zoomScale: this.zoomScale}}).catch(err => {
                });
            });
        },

        mounted() {
            let self = this;
            const script = function (p5) {

                let locs = [];
                let attacklist = [];
                let pulses = [];
                let data = {
                    locs: []
                };
                let canvas;
                let img = document.getElementById("basemap");
                let klean = [p5.loadImage(klean1), p5.loadImage(klean2), p5.loadImage(klean3)];

                let CURVE = 4;
                let CURVE_VAR = 1;
                let GROUP_SIZE = 100;
                let TEAM_CIRCLE = 20;
                let TAIL_COUNT = 50;
                let PULSE_SIZE = 150;
                let MAX_PULSE_ALPHA = 220;
                let MAX_INTENSITY = 500;

                let imgWidth = self.width;
                let imgHeight = self.height;
                let htmlCanvasElement;

                p5.setup = _ => {
                    canvas = p5.createCanvas(imgWidth, imgHeight);
                    canvas.parent("p5Canvas");
                    htmlCanvasElement = document.querySelector('canvas');

                    self.teams.forEach(team => {
                        locs.push(new Location((team.location.x + 81 / 2) / 2, (team.location.y + 90 / 2) / 2, team.id));
                    });

                    self.attacks.forEach(att => {
                        let locFrom = locs[att[0]];
                        let locTo = locs[att[1]];
                        attacklist.push(new Attack(locFrom, locTo, att[2]));
                    });

                };

                p5.draw = _ => {
                    p5.background("#7585b2");
                    p5.scale(self.zoomScale);

                    p5.color("");
                    p5.fill("");
                    p5.stroke("white");

                    htmlCanvasElement.getContext("2d").drawImage(img, 0, 0, imgWidth, imgHeight);

                    locs.forEach(value => value['draw']());
                    attacklist.forEach(value => value['draw']());
                    pulses.forEach(value => value['draw']());


                    for (let i = attacklist.length -1 ; i >= 0; i--) {
                        if (attacklist[i].completed) {
                            attacklist.splice(i, 1);
                        }
                    }
                };

                function randomChoose(arr) {
                    return arr[Math.floor(Math.random() * arr.length)]
                }

                function Pulse(loc, intensity) {
                    this.loc = loc;
                    this.intensity = intensity;
                    this.pulseCount = 1;
                    this.completed = false;
                    this.rings = [
                        {
                            curRadius: 0,
                            color: "rgba(217,81,0,0.5)",
                            completed: false
                        }, {
                            curRadius: -75,
                            color: "rgba(255,254,0,0.6)",
                            completed: false
                        }, {
                            curRadius: -150,
                            color: "rgba(217,81,0,0.5)",
                            completed: false
                        }
                    ];

                    this.draw = function () {
                        if (!this.completed) {
                            if (this.pulseCount <= 1000) {
                                this.pulseCount *= 1;
                                this.drawRings(this.rings);

                            } else {
                                this.completed = true;
                            }
                        }
                    };

                    this.drawRings = function (rings) {
                        rings.forEach((ring, index) => {
                            if (ring.curRadius < PULSE_SIZE) {
                                ring.curRadius += 2;
                                if (ring.curRadius > 0) {
                                    let alphaVal = MAX_PULSE_ALPHA - ring.curRadius;

                                    p5.colorMode('RGBA');
                                    let c = p5.color(ring.color);
                                    c.setAlpha(alphaVal <= 0 ? 0 : alphaVal);
                                    p5.fill(c);
                                    p5.noStroke();
                                    p5.circle(this.loc.x, this.loc.y, ring.curRadius);
                                }
                            } else {
                                ring.completed = true;
                            }
                        });
                    }
                }

                function Location(x, y, id) {
                    this.x = x;
                    this.y = y;
                    this.id = id;
                    this.pulsing = false;
                    this.pulseCount = 1;

                    this.draw = () => {
                        p5.stroke("white");
                        p5.fill("white");
                        // p5.circle(this.x, this.y, TEAM_CIRCLE);
                    };
                }

                function Attack(locFrom, locTo, num) {

                    MAX_INTENSITY = num > MAX_INTENSITY ? num : MAX_INTENSITY;

                    this.curX = this.startX = locFrom.x;
                    this.curY = this.startY = locFrom.y;

                    this.endX = locTo.x;
                    this.endY = locTo.y;

                    this.distX = this.endX - this.startX;
                    this.distY = this.endY - this.startY;
                    this.reachedDest = false;
                    this.completed = false;
                    this.tail = [];
                    this.t = 0;
                    let tx = this.endX - this.curX,
                        ty = this.endY - this.curY,
                        dist = Math.sqrt(tx * tx + ty * ty);

                    this.step = .01 * (1000 / (dist - 100));

                    this.draw = () => {
                        if (!this.completed) {

                            if (!this.reachedDest) {
                                if (this.t < 1) {

                                    this.t += this.step;

                                    let oldX = this.curX;
                                    let oldY = this.curY;


                                    let xIncrease = Math.pow(this.t, 1) * this.distX;
                                    let yIncrease = Math.pow(this.t, 3) * this.distY;

                                    // let xIncrease = this.distX / (100);
                                    // let yIncrease = this.distY / (100);

                                    this.curX = this.startX + xIncrease;
                                    this.curY = this.startY + yIncrease;


                                    if (p5.frameCount % 4 === 0) {
                                        if (this.tail.length > TAIL_COUNT) {
                                            this.tail.pop();
                                        }
                                        this.tail.unshift([this.curX, this.curY]);
                                    }

                                    let dx = this.curX - oldX;
                                    let dy = this.curY - oldY;

                                    let theta = Math.atan2(dy, dx); // range (-PI, PI]

                                    p5.push();
                                    p5.translate(this.curX, this.curY);
                                    p5.rotate(theta);
                                    p5.imageMode(p5.CENTER);
                                    p5.image(klean[p5.frameCount % 3], 0, 0, 100 * (.5 + (num / MAX_INTENSITY)), 100 * (.5 + (num / MAX_INTENSITY)));
                                    p5.pop();


                                    if (this.tail.length >= 1) {
                                        p5.strokeWeight(5);
                                        p5.stroke('rgba(255,215,0,0.75)');
                                        p5.noFill();
                                        p5.beginShape();
                                        for (let i = 0; i < this.tail.length; i++) {
                                            let curtail = this.tail[i];
                                            p5.vertex(curtail[0], curtail[1]);
                                        }
                                        p5.endShape();
                                    }
                                } else {
                                    this.reachedDest = true;
                                    pulses.push(new Pulse(locTo, num))
                                }

                            }
                            if (this.reachedDest && this.tail.length >= 1) {

                                p5.strokeWeight(5);
                                p5.stroke('rgba(255,215,0,0.75)');
                                p5.noFill();
                                p5.beginShape();
                                for (let i = 0; i < this.tail.length; i++) {
                                    let curtail = this.tail[i];
                                    p5.vertex(curtail[0], curtail[1]);
                                }
                                p5.endShape();
                                this.tail.pop()
                            }

                            if (this.reachedDest && this.tail.length < 1) {
                                this.completed = true;
                            }
                        }

                    }
                }

                let updateTask = window.setInterval(() => {

                    if (attacklist.length < 4) {
                        for (let i = 0; i < 4; i++) {
                            let ra = self.randomAttack(Math.floor(Math.random() * 26), 26, 1000);
                            attacklist.push(new Attack(locs[ra[0]], locs[ra[1]], ra[2]));
                        }
                    }
                    console.log(attacklist);


                }, 3000);
            };
            const P5 = require('p5');
            new P5(script)
        }
    }
</script>

<style>
	.map-back {
		background: #7585b2;
	}

</style>