import * as d3 from 'd3'; // NO I18N
import map from '../assets/img/basemap.png';
import icon from "./icon";
import axios from "axios";
import explosive from "./image/explosion.webp";
// console.log("testing",JSON.stringify(collection.wbc.map(each=>each.id)))

let width = 7643;
let height = 3514;
let clientWidth ,clientHeight ;
let teams =[
    { "name": "Debug Thugs",    "defendScore": 33, "attackScore": 13, "damageScore": 6,
        location : {x:5956,y:1244}
    },
    {
        "name": "Verithanam Hackers",
        "defendScore": 198,
        "attackScore": 9,
        "damageScore": 47,
        location : {x:3028,y:947}

    },
    {
        "name": "Shadowkhan",
        "defendScore": 325,
        "attackScore": 38,
        "damageScore": 49,
        location : {x:5483,y:2674}
    },
    {
        "name": "Fun Panrom",
        "defendScore": 487,
        "attackScore": 14,
        "damageScore": 14,
        location : {x:5875,y:2583}
    },
    {
        "name": "Irakamatravargal",
        "defendScore": 285,
        "attackScore": 20,
        "damageScore": 8,
        location : {x:6003,y:1872}
    },
    {
        "name": "HeartHackers",
        "defendScore": 135,
        "attackScore": 20,
        "damageScore": 54,
        location : {x:2972,y:2513}
    },
    {
        "name": "Cliq Geeks",
        "defendScore": 41,
        "attackScore": 22,
        "damageScore": 13,
        location : {x:1630,y:2422}
    },
    {
        "name": "Ithellam Enga urupada poguthu",
        "defendScore": 264,
        "attackScore": 45,
        "damageScore": 60,
        location : {x:5003,y:2401}
    },
    {
        "name": "CLIQ-GEEK",
        "defendScore": 266,
        "attackScore": 5,
        "damageScore": 8,
        location : {x:6203,y:2891}
    },
    {
        "name": "SitesCyber",
        "defendScore": 195,
        "attackScore": 17,
        "damageScore": 72,
        location : {x:2520,y:2531}
    },
    {
        "name": "CodeProject",
        "defendScore": 183,
        "attackScore": 13,
        "damageScore": 10,
        location : {x:2479,y:1733}
    },
    {
        "name": "Searching...",
        "defendScore": 41,
        "attackScore": 73,
        "damageScore": 33,
        location : {x:7148,y:2300}
    },
    {
        "name": "Christopher",
        "defendScore": 42,
        "attackScore": 31,
        "damageScore": 20,
        location : {x:5366,y:636}
    },
    {
        "name": "venom",
        "defendScore": 536,
        "attackScore": 6,
        "damageScore": 11,
        location : {x:2174,y:2326}
    },
    {
        "name": "Virus",
        "defendScore": 995,
        "attackScore": 55,
        "damageScore": 22,
        location : {x:6632,y:1442}
    },
    {
        "name": "Avengers",
        "defendScore": 258,
        "attackScore": 1,
        "damageScore": 9,
        location : {x:6236,y:497}
    },
    {
        "name": "SPARKS",
        "defendScore": 135,
        "attackScore": 11,
        "damageScore": 23,
        location : {x:6495,y:1102}
    },
    {
        "name": "Zyber Punks",
        "defendScore": 72,
        "attackScore": 4,
        "damageScore": 13,
        location : {x:4147,y:2216}
    },
    {
        "name": "I do not know",
        "defendScore": 3,
        "attackScore": 18,
        "damageScore": 39,
        location : {x:998,y:1782}
    },
    {
        "name": "Mostwanted",
        "defendScore": 122,
        "attackScore": 5,
        "damageScore": 16,
        location : {x:1838,y:547}
    },
    {
        "name": "Anonymous",
        "defendScore": 355,
        "attackScore": 14,
        "damageScore": 57,
        location : {x:1829,y:1671}
    },
    {
        "name": "Firewall ",
        "defendScore": 42,
        "attackScore": 38,
        "damageScore": 6,
        location : {x:1429,y:1303}
    },
    {
        "name": "Mavericks",
        "defendScore": 261,
        "attackScore": 18,
        "damageScore": 74,
        location : {x:910,y:2123}
    },
    {
        "name": "CyberWarriors",
        "defendScore": 404,
        "attackScore": 9,
        "damageScore": 24,
        location : {x:856,y:2752}
    },
    {
        "name": "vadawow",
        "defendScore": 12,
        "attackScore": 36,
        "damageScore": 6,
        location : {x:2159,y:2891}
    },
    {
        "name": "Team Soona Paana",
        "defendScore": 8,
        "attackScore": 66,
        "damageScore": 22,
        location : {x:669,y:775}
    }
]
let teamNameIdMap = {};

let teamNameMapping ={

};
let conf = {
    speed : width/5000,
    attackTransitionTime : 1000,
    noCloud:false,
    cloudSize :10,
    isCloudTypeDot : false,
    asteroidSize : 50,
    asteroidMaxSize :150,
    explodeWidth : 200,
    requestAccessInfoForEvery : 10000,
    requestStatForEvery : 10000,
    attackWaveGap :300
};
let maxIntensity = localStorage.maxIntensity || 10;


export default class AttackMap{
    constructor (container){
        this.container =container;
        this.teams = processTeams(teams);
        this.requiredIconList=['asteroid','fire','cloud','fire2'];

        this.svg = d3.select(this.container)
            .append("svg")
            // .attr('preserveAspectRatio','none')
            .attr('viewBox',`0 0 ${width} ${height}`);

        this.loadSymbols();
        this.plotTeams();
        this.runForRandomValue();
    }

    run(){
        let noOfWaves = conf.requestAccessInfoForEvery/conf.attackWaveGap;
        axios.get("http://172.24.117.157:8080/getkeysetstats").then(res=>{
            console.log(res.data)
            let fullList = res.data.res.data;
            noOfWaves = Math.max(noOfWaves,fullList.length);
            let objectPerWave = fullList.length/noOfWaves;

            for(let i = 0;i<noOfWaves;i++){
                let list  = fullList.slice(Math.floor(i*objectPerWave),Math.ceil((i+1)*objectPerWave));
                setTimeout(()=>{
                    list.forEach((obj,i)=>{
                        try{
                            let key = Object.keys(obj);
                            let temp = key.split('-')
                            let team1 = temp[0];
                            let team2 = temp[1];
                            this.drawCureve(teamNameIdMap[teamNameMapping[team1]],teamNameIdMap[teamNameMapping[team2]],obj[key]);

                        }catch (e) {
                        }
                    })
                },i&&conf.attackWaveGap);
            }

        });
        setTimeout(()=>{this.run()},conf.requestAccessInfoForEvery)
    }

    fetchStats(){
        axios.get("http://172.24.117.157:8080/getkeysetstats").then(res=>{
            console.log(res.data.Keyset_Stats);
        });
        setTimeout(()=>{this.fetchStats()},conf.requestStatForEvery)
    }

    runForRandomValue(){
        let from  = Math.ceil( Math.random()*this.teams.length)-1;
        let to  = Math.ceil( Math.random()*this.teams.length)-1;
        let intensity = Math.ceil(Math.random() *5);
        try{

            this.drawCureve(from,to,intensity);
        }catch (e) {
            console.log(from,to,intensity,e)
        }
        setTimeout(()=>this.runForRandomValue(),Math.random()*50);
    }



    drawCureve(from,to, intensity){
        if(intensity>maxIntensity){
            localStorage.maxIntensity = maxIntensity = intensity;
        }
        let fromTeam = this.teams[from];
        let toTeam = this.teams[to];
        let fromLocation = fromTeam.location;
        let toLocation = toTeam.location;
        let x  = toLocation.x - fromLocation.x;
        let y  = toLocation.y - fromLocation.y;
        let angle = 0;
        let dx = x,dy=y;
        let oppositeSide = dy;
        let elevationFactor =1;
        if(x>0){
            elevationFactor *=-1;
            if(y<0){
                dy *=-1;
                angle =270;
                oppositeSide = dx;
            }
        }else{
            dx *=-1;
            angle = 90;
            if(y<0){
                dy *=-1;
                angle =180;
                oppositeSide = dy;
            }else{
                oppositeSide = dx;
            }
        }
        let radius = Math.sqrt(x*x +y*y);
        angle += Math.asin(oppositeSide/radius)* 180 / Math.PI;

        
        let attackPos = `translate(${fromLocation.x},${fromLocation.y}) rotate(${angle})`;
        
        let track = this.svg.append("g").attr('class','track') .attr('transform',attackPos);

        let cloudLength=0;
        let heightEl = 0;

        let trackPath = track.append('path')
            .attr('d',`M0,0 C -${cloudLength/2} ,${heightEl},   -${cloudLength/2} , ${heightEl} ,-${cloudLength},0`)
            .attr('stroke','#fdea41')
            .attr('stroke-width',conf.cloudSize)
            .attr('fill','transparent')
            .attr('style','stroke-dasharray: 100;')





        let asteroidWidth  = conf.asteroidSize+(intensity/maxIntensity)*(conf.asteroidMaxSize-conf.asteroidSize);
        let attack = this.svg.append("g") .attr('transform',attackPos);
        attack
            .append('g')
            .attr('transform',`translate(0,${asteroidWidth/2})  rotate(270)`)
            .append("use") // NO I18N
            .attr('xlink:href',d=>`#symbol-icon-asteroid`) // NO I18N
            .attr('width',asteroidWidth) // NO I18N
            .attr('height',asteroidWidth*2) // NO I18N

        let currentRadius = 0;
        let time = radius/conf.speed;
        let maxElevation = radius/(Math.PI*2);

        const interpolate = d3.interpolate( 0,radius);
        const t = this.svg.transition().duration(time);

        attack.transition(t)
            .ease(d3.easeLinear)
            .tween("data", () => { // NO I18N
                return t => (currentRadius = interpolate(t));
            })
            .attrTween("transform", ()=>(time)=>{
                let t =time *2;
                let exponent = 2;
                let intialAngle = 45 || 180/Math.PI;
                let currentAngle = 0 + Math.pow(t-1,exponent) * (intialAngle);
                let translate = maxElevation - Math.pow(t-1,exponent) * (maxElevation);

                if(t>1){
                    t -= 1;
                    currentAngle = 0 - Math.pow(t,exponent) * (intialAngle);
                    translate = maxElevation - Math.pow(t,exponent) * (maxElevation);
                }
                translate =translate*elevationFactor;

                let cloudLength=Math.sqrt(currentRadius*currentRadius+translate*translate);
                let heightEl = (maxElevation*time+(0*maxElevation))*elevationFactor*currentRadius/radius;
                let xDiff = (radius/7)*time;
                let yDiff = (radius*2/35)*time*elevationFactor;

                if(!conf.isCloudTypeDot && !conf.noCloud){
                    trackPath
                        .attr('d',`M0,0 
                        C   ${cloudLength/2-xDiff} , ${translate/2+heightEl+yDiff},   
                            ${cloudLength/2+xDiff} , ${translate/2+heightEl+yDiff} ,
                            ${cloudLength},${translate}`)
                }else if(!conf.noCloud){
                    let gg= track.append('g')
                        .attr('transform',`translate(${currentRadius},${translate-conf.cloudSize/2}) rotate(${currentAngle*elevationFactor})`)
                    gg.append('circle')
                        .attr('fill','#fdea41')
                        .attr('r',conf.cloudSize/2)
                        .attr('cx',-conf.cloudSize/2)
                        .attr('cy',-conf.cloudSize/2)
                }
                return `${attackPos} translate(${currentRadius},${translate}) rotate(${currentAngle*elevationFactor})`;
            })




        setTimeout(()=>{ attack.remove();setTimeout(()=>{track.remove()},1000) },time);

        setTimeout(()=>{
            let destination = this.svg.append("image") // NO I18N
                .attr('style',`transform : translate(${toLocation.x}px,${toLocation.y}px) translate(-${conf.explodeWidth/2}px,-${conf.explodeWidth*5/2-20}px) `)
                .attr('xlink:href',explosive) // NO I18N
                .attr('width',conf.explodeWidth) // NO I18N
                .attr('height',conf.explodeWidth*5) // NO I18N
            setTimeout(()=>{ destination.remove() },conf.attackTransitionTime)
        },time)
    }

    plotTeams(){

     this.svg.append('image')
         .attr('href',map)
         .attr('width',width)
         .attr('height',height)




        document.body.addEventListener('click',function(e){
            let x= e.clientX;
            let y= e.clientY;
            clientWidth = document.body.clientWidth;
            clientHeight = document.body.clientHeight;
            console.log(x*width/clientWidth,y*height/clientHeight)
        })

        // let country = this.svg.append('g').selectAll("g")
        //     .data(this.teams)
        //     .enter()
        //     .append("g")
        //     .attr('data-name',each=>each.name)
        //     .attr("transform", team =>`translate(${team.location.x},${team.location.y})`);


        // let fireWidth = 100;
        // country.append("use") // NO I18N
        //     .attr('style',`transform : translate(-${fireWidth/2}px,-${fireWidth*5/2-70}px) `)
        //     .attr('xlink:href',d=>`#symbol-icon-fire`) // NO I18N
        //     .attr('width',fireWidth) // NO I18N
        //     .attr('height',fireWidth*5) // NO I18N

        // country.append("circle")
        //     .attr("r", 50)
        //     .attr("fill", "hsl(0,50%,70%)");




    }

    loadSymbols(){
        let symbol = this.svg.selectAll("symbol").data(this.requiredIconList.map(each=>icon(each))).join('symbol') // NO I18N
            .attr('id',d=>d.id) // NO I18N
            .attr('viewBox',d=>d.viewBox.join(' ')); // NO I18N
        symbol.append('rect') // NO I18N
            .attr('x',d=>`${d.viewBox[0]}px`) // NO I18N
            .attr('y',d=>`${d.viewBox[1]}px`) // NO I18N
            .attr('width',d=>`${d.viewBox[2]-d.viewBox[0]}px`) // NO I18N
            .attr('height',d=>`${d.viewBox[3]-d.viewBox[1]}px`) // NO I18N
            .attr('stroke','transparent') // NO I18N
            .attr('fill','transparent'); // NO I18N
        symbol.append('g')// NO I18N
            .html(d=>d.html);

    }
}
// return object country

function processTeams(teamList){
    let size = teamList.length;

    teamList.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
    });

    for(let i=0;i<teamList.length;i++){
        let team = teamList[i];
        let id = i;
        team.id = id;
        teamNameIdMap[team.name] = id;
        // team.country = getByIsoId(selectedCountries[team.id]);
        // let loc = projection([team.country.longitude, team.country.latitude]);
        // 81 139
        let location = team.location || {x:200,y:200}
        team.location = {x:location.x+(81/2),y:location.y+(139/2)};
    }
    return teamList;
}




