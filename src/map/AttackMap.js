import * as d3 from 'd3'; // NO I18N
import map from '../assets/img/basemap.png';
import icon from "./icon";
import axios from "axios";
import explosive from "./image/explosion.webp";


let clientWidth, clientHeight;
let teamNameIdMap = {};
let maxIntensity = localStorage.maxIntensity || 10;
let width, height, teams, redTeamMapping, conf,blueTeamMapping ;

import {shuffle} from "lodash";

class AttackMap {
    constructor(container) {
        this.container = container;
        this.teams = processTeams(teams);
        this.requiredIconList = ['asteroid', 'fire', 'cloud', 'fire2', 'red-1', 'red-2', 'red-3', 'blue-1', 'blue-2', 'blue-3','firework'];

        this.svg = d3.select(this.container).append("svg")
            .attr('viewBox', `0 0 ${width} ${height}`);

        if (conf.calculatePosition) {
            this.svg.attr('preserveAspectRatio', 'none');
        }
        this.loadSymbols();
        this.plotTeams();
        if (conf.production) {
            this.fetchStats();
            this.run();
        } else {
            this.runForRandomValue();
            this.runForRandomRank();
        }

    }

    run() {
        let noOfWaves = conf.requestAccessInfoForEvery / conf.attackWaveGap;
        axios.get(conf.warLogUrl).then(res => {
            let fullList = res.data.data;
            // console.log('access',fullList)
            // if(fullList.length){
            //     debugger
            // }

            let incList = [];
            for(let i=0;i<fullList.length;i++){
                let each =fullList[i];
                for(let j=0;j<conf.asteroidIncrementFactor;j++){
                    incList.push(each)
                }
            }
            let attackWaveGap = conf.requestAccessInfoForEvery/noOfWaves;

            console.log("-------------------")
            console.log(fullList.length)
            fullList =shuffle(incList);
            console.log(fullList.length)

            noOfWaves = Math.min(noOfWaves, fullList.length);

            let objectPerWave = fullList.length / noOfWaves;

            for (let i = 0; i < noOfWaves; i++) {
                let list = fullList.slice(Math.ceil(i * objectPerWave), Math.ceil((i + 1) * objectPerWave));

                setTimeout(() => {
                    console.log("timeout",i,list.length,(new Date()).getTime())

                    list.forEach((obj) => {
                        try {
                            let key = Object.keys(obj)[0];
                            let temp = key.split('-')
                            let team1 = temp[0];
                            let team2 = temp[1];

                            this.drawCureve(this.getRandomTeam(team1), teamNameIdMap[blueTeamMapping[team2]], obj[key]);

                        } catch (e) {
                        }
                    })
                }, i && attackWaveGap);
                console.log('time',i && attackWaveGap)
            }

        });
        setTimeout(() => {
            this.run()
        }, conf.requestAccessInfoForEvery)
    }
    getRandomTeam(teamName){
        let res = teamNameIdMap[redTeamMapping[teamName]];
        if(!this.availList){
            this.availList =[];
            this.teams.forEach((each,i)=>{
                this.availList.push(i);
            })
        }
        if(res!==undefined){
            let ind = this.availList.indexOf(res);
            if(ind!==-1){
                this.availList.splice(this.availList.indexOf(res),1)
            }else if(this.randomTeamMap[teamName] !==res && this.randomTeamMap[teamName]!==undefined){
                for(let key in this.randomTeamMap){
                    if(this.randomTeamMap[key] ===res && key!==teamName){
                        delete this.randomTeamMap[key];
                        break;
                    }
                }
            }
            this.randomTeamMap[teamName] = res;
            return res;
        }

        this.randomTeamMap = this.randomTeamMap || {};
        if(this.randomTeamMap[teamName]===undefined){
            let ind =Math.floor(this.availList.length * Math.random());
            this.randomTeamMap[teamName]=this.availList[ind];
            this.availList.splice(ind,1)

        }
        return this.randomTeamMap[teamName];
    }

    fireworkAt(location){
        let firework = this.svg.append("use") // NO I18N
            .attr('style', `transform : translate(${location.x}px,${location.y}px) translate(-${conf.fireworkWidth / 2}px,-${conf.fireworkWidth /2}px) `)
            .attr('xlink:href', d => `#symbol-icon-firework`) // NO I18N
            .attr('width', conf.fireworkWidth) // NO I18N
            .attr('height', conf.fireworkWidth) // NO I18N
        setTimeout(() => {
            firework.remove()
        }, conf.attackTransitionTime)
    }

    fetchStats() {
        axios.get(conf.statusUrl).then(res => {
            // console.log(res.data.Keyset_Stats);
            let data = res.data;
            let map ={};
            this.loaded =true;
            data.blue_team.forEach(each=>{
                map[each.team_name]={
                    Team_name:each.team_name,
                    BScore:each.total_score || 0,
                    RScore : 0
                }
            })
            data.red_team.forEach(each=>{
                let old = map[each.team_name];
                map[each.team_name]={
                    Team_name:each.team_name,
                    BScore:old && old.BScore || 0,
                    RScore : each.total_score || 0
                }
            });
            data = Object.values(map);
            data.forEach(each => {
                let index = this.teams.findIndex(e => e.name === each.Team_name);
                if (index !== -1) {
                    this.teams[index].redScore = each.RScore;
                    this.teams[index].blueScore = each.BScore;
                }
            });
            this.plotRank();
        });
        setTimeout(() => {
            this.fetchStats()
        }, conf.requestStatForEvery)
    }

    runForRandomValue() {
        let from = Math.ceil(Math.random() * this.teams.length) - 1;
        let to = Math.ceil(Math.random() * this.teams.length) - 1;
        let intensity = Math.ceil(Math.random() * 5);
        try {
            this.drawCureve(from, to, intensity);
        } catch (e) {
            console.log(from, to, intensity, e)
        }
        setTimeout(() => this.runForRandomValue(), Math.random() * conf.randomTimeGap);
    }

    runForRandomRank() {
        try {
            for (let i = 0; i < this.teams.length; i++) {
                let team = this.teams[i];
                team.redScore = Math.ceil(Math.random() * this.teams.length) - 1;
                team.blueScore = Math.ceil(Math.random() * this.teams.length) - 1;
            }
            this.plotRank();
        } catch (e) {
            console.log(e)
        }
        setTimeout(() => this.runForRandomRank(), Math.random() * conf.randomTimeGap*30);
    }


    drawCureve(from, to, intensity) {
        if (intensity > maxIntensity) {
            localStorage.maxIntensity = maxIntensity = intensity;
        }

        let fromTeam = this.teams[from];
        let toTeam = this.teams[to];
        if(!fromTeam || !toTeam){
            return;
        }
        let fromLocation = fromTeam.location;
        let toLocation = toTeam.location;
        let x = toLocation.x - fromLocation.x;
        let y = toLocation.y - fromLocation.y;
        let angle = 0;
        let dx = x, dy = y;
        let oppositeSide = dy;
        let elevationFactor = 1;
        if (x > 0) {
            elevationFactor *= -1;
            if (y < 0) {
                dy *= -1;
                angle = 270;
                oppositeSide = dx;
            }
        } else {
            dx *= -1;
            angle = 90;
            if (y < 0) {
                dy *= -1;
                angle = 180;
                oppositeSide = dy;
            } else {
                oppositeSide = dx;
            }
        }
        let radius = Math.sqrt(x * x + y * y);
        angle += Math.asin(oppositeSide / radius) * 180 / Math.PI;


        let attackPos = `translate(${fromLocation.x},${fromLocation.y}) rotate(${angle})`;

        let track = this.svg.append("g").attr('class', 'track').attr('transform', attackPos);

        let pathArray = [];

        let trackPath = track.append('path')
            .attr('d', arrayPosition(pathArray))
            .attr('stroke', '#fdea41')
            .attr('stroke-width', conf.tailSize)
            .attr('fill', 'transparent')


        let asteroidWidth = conf.asteroidSize + (intensity / maxIntensity) * (conf.asteroidMaxSize - conf.asteroidSize);
        let attack = this.svg.append("g").attr('transform', attackPos);
        attack
            .append('g')
            .attr('transform', `translate(0,${asteroidWidth / 2})  rotate(270)`)
            .append("use") // NO I18N
            .attr('xlink:href', d => `#symbol-icon-asteroid`) // NO I18N
            .attr('width', asteroidWidth) // NO I18N
            .attr('height', asteroidWidth * 2) // NO I18N

        let currentRadius = 0;
        let asteroidTime = radius / conf.speed;
        let maxElevation = radius / (Math.PI * 2);

        const interpolate = d3.interpolate(0, radius);
        const t = this.svg.transition().duration(asteroidTime);
        let iteration = 0;
        attack.transition(t)
            .ease(d3.easeLinear)
            .tween("data", () => { // NO I18N
                return t => (currentRadius = interpolate(t));
            })
            .attrTween("transform", () => (time) => {
                let t = time * 2;
                let exponent = 2;
                let intialAngle = 45 || 180 / Math.PI;
                let currentAngle = 0 + Math.pow(t - 1, exponent) * (intialAngle);
                let translate = maxElevation - Math.pow(t - 1, exponent) * (maxElevation);

                if (t > 1) {
                    t -= 1;
                    currentAngle = 0 - Math.pow(t, exponent) * (intialAngle);
                    translate = maxElevation - Math.pow(t, exponent) * (maxElevation);
                }
                translate = translate * elevationFactor;

                if (!conf.noTail) {
                    iteration ++;
                    if(iteration%conf.tailPointsGap===0 || !time || time===1){
                        pathArray.push([currentRadius,translate])
                        trackPath.attr('d',arrayPosition(pathArray))
                    }
                    if(time===1){
                        const trackHiding = this.svg.transition().duration(asteroidTime);
                        let trackLength = pathArray.length;
                        trackPath.transition(trackHiding)
                            .ease(d3.easeLinear)
                            .attrTween('d',()=>(tt)=> arrayPosition(pathArray,Math.round(trackLength*tt),trackLength))
                    }
                }
                return `${attackPos} translate(${currentRadius},${translate}) rotate(${currentAngle * elevationFactor})`;
            })


        setTimeout(() => {
            attack.remove();
            setTimeout(() => {
                track.remove()
            }, asteroidTime)
        }, asteroidTime);

        setTimeout(() => {
            let explodeWidth  =conf.explodeMinWidth + (intensity / maxIntensity)*(conf.explodeMaxWidth-conf.explodeMinWidth);
            let destination = this.svg.append("image") // NO I18N
                .attr('style', `transform : translate(${toLocation.x}px,${toLocation.y}px) translate(-${explodeWidth / 2}px,-${explodeWidth * 5 / 2 - 20}px) `)
                .attr('xlink:href', explosive) // NO I18N
                .attr('width', explodeWidth) // NO I18N
                .attr('height', explodeWidth * 5) // NO I18N
            setTimeout(() => {
                destination.remove()
            }, conf.attackTransitionTime)
        }, asteroidTime)
    }

    plotTeams() {

        this.svg.append('image')
            .attr('href', map)
            .attr('width', width)
            .attr('height', height);

        if (conf.calculatePosition) {
            document.body.addEventListener('click', function (e) {
                let x = e.clientX;
                let y = e.clientY;
                clientWidth = document.body.clientWidth;
                clientHeight = document.body.clientHeight;
                console.log(x * width / clientWidth, y * height / clientHeight)
            })
        }

        //  attack
        //     .append('g')
        //     .attr('transform',`translate(-${astroidWidth*2},${astroidWidth/2})  rotate(270)`)
        //     .append("use") // NO I18N
        //     .attr('xlink:href',d=>`#symbol-icon-asteroid`) // NO I18N
        //     .attr('width',astroidWidth) // NO I18N
        //     .attr('height',astroidWidth*2) // NO I18N


        // country.append("circle")
        //     .attr("r", 50)
        //     .attr("fill", "hsl(0,50%,70%)");


    }

    loadSymbols() {
        let symbol = this.svg.selectAll("symbol").data(this.requiredIconList.map(each => icon(each))).join('symbol') // NO I18N
            .attr('id', d => d.id) // NO I18N
            .attr('viewBox', d => d.viewBox.join(' ')); // NO I18N
        symbol.append('rect') // NO I18N
            .attr('x', d => `${d.viewBox[0]}px`) // NO I18N
            .attr('y', d => `${d.viewBox[1]}px`) // NO I18N
            .attr('width', d => `${d.viewBox[2] - d.viewBox[0]}px`) // NO I18N
            .attr('height', d => `${d.viewBox[3] - d.viewBox[1]}px`) // NO I18N
            .attr('stroke', 'transparent') // NO I18N
            .attr('fill', 'transparent'); // NO I18N
        symbol.append('g')// NO I18N
            .html(d => d.html);

    }

    plotRank() {
        let redScoreSorted = [...this.teams];
        redScoreSorted.sort((a, b) =>  (b.redScore -a.redScore ||  b.blueScore- a.blueScore) ).forEach((each, i) => {
            if(each.redRank>i+1){
                this.fireworkAt(each.redBadgeLocation);
            }
            each.redRank = i + 1
        })
        let blueScoreSorted = [...this.teams];
        blueScoreSorted.sort((a, b) =>( b.blueScore- a.blueScore || b.redScore-a.redScore) ).forEach((each, i) => {
            if(each.blueRank>i+1){
                this.fireworkAt(each.blueBadgeLocation);
            }
            each.blueRank = i + 1
        });
        if (this.redRankContainer) {
            this.redRankContainer.remove();
        }
        if (this.blueRankContainer) {
            this.blueRankContainer.remove();
        }

        // let blueScoreReducedCount = this.teams.filter(each => (each.blueScore<15)).length;
        // console.log('blueScoreReducedCount',blueScoreReducedCount,this.teams.filter(each => (each.blueScore<15)))
        this.redRankContainer = this.svg.append("g");

        this.redRankContainer.selectAll("use")
            .data(this.teams.filter(each => (each.redRank < 4 && each.redScore>0)))
            .enter()
            .append("use")
            .attr('data-name', each => each.name)
            .attr('style', team => `transform : translate(${team.redBadgeLocation.x - conf.rankIconSize / 2}px,${team.redBadgeLocation.y - conf.rankIconSize / 2}px) `)
            .attr('xlink:href', d => `#symbol-icon-red-${d.redRank}`) // NO I18N
            .attr('width', conf.rankIconSize) // NO I18N
            .attr('height', conf.rankIconSize) // NO I18N

        this.blueRankContainer = this.svg.append("g");
        this.blueRankContainer.selectAll("use")
            .data(this.teams.filter(each => (each.blueRank < 4&& each.blueScore>0 )))
            .enter()
            .append("use")
            .attr('data-name', each => each.name)
            .attr('style', team => `transform : translate(${team.blueBadgeLocation.x - conf.rankIconSize / 2}px,${team.blueBadgeLocation.y - conf.rankIconSize / 2}px) `)
            .attr('xlink:href', d => `#symbol-icon-blue-${d.blueRank}`) // NO I18N
            .attr('width', conf.rankIconSize) // NO I18N
            .attr('height', conf.rankIconSize) // NO I18N
    }
}

// return object country

function processTeams(teamList) {
    let size = teamList.length;

    teamList.sort(function (a, b) {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    });

    for (let i = 0; i < teamList.length; i++) {
        let team = teamList[i];
        let id = i;
        team.id = id;
        teamNameIdMap[team.name] = id;
        let location = team.location || {x: 200, y: 200}
        team.location = {x: location.x + (81 / 2), y: location.y + (139 / 2)};
        team.redScore = 0;
        team.blueScore = 0;
    }
    return teamList;
}


function arrayPosition(array,from=0,to){
    if(!array || array.length<1){
        return "";
    }
    let i =from;


    to = (to===undefined)?array.length:to;
    to = Math.min(array.length,to);
    if(from>=to){
        return "";
    }

    let result = `M ${array[i][0]} , ${array[i][1]}`
    for(i=i+1;i<to;i++){
        result += `L ${array[i][0]} , ${array[i][1]}`
    }
    return result
}

export default function (container) {
    // import {width, height, teams, redTeamMapping, conf} from './conf'
    require(['./conf'],function(data){
        width = data.width;
        height = data.height;
        teams = data.teams;
        redTeamMapping =data.redTeamMapping;
        blueTeamMapping=data.blueTeamMapping;
        conf =data.conf;
        new AttackMap(container);

    })
}

