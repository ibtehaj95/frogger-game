let user_pos = 0; //initial position of user
let user_pos_prev = 0;
const game_map = document.querySelectorAll(".tile");
const game_map_maxtile = game_map.length-1;
const game_map_mintile = 0;
const col_count = document.querySelector(".resting").children.length;
let crow_min = 0;
let crow_max = 0;
const start_btn = document.getElementById("start-btn");
const reload_btn = document.getElementById("reload-btn");
let event_chk_tmr = 0;
let game_stop = 0;
let npcs = [];
const score_elem = document.getElementById("score-panel-number");
let score = parseInt(score_elem.textContent);
const rcrd_elem = document.getElementById("record-panel-number");
let record = parseInt(rcrd_elem.textContent);
const lvs_elem = document.getElementById("lives-panel-number");

let lives = parseInt(lvs_elem.textContent);
const tmr_elem = document.getElementById("timer-panel-number");
let time_left = parseInt(tmr_elem.textContent);
let timer = 0;
let rcrd_ary = [];

class Enemy{
    start_tile = 0;
    end_tile = 0;
    now_tile = 0;
    now_tile_prev = 0;
    direction = "";
    speed = 0;
    enem_type = "";
    timer = 0;
    respawn_enem = 0;

    constructor(start_pos, mov_dir, enem_type, enem_name){
        this.start_tile = start_pos;
        this.direction = mov_dir;
        this.enem_type = enem_type;
        this.speed = this.get_randint();
        npcs.push(enem_name);

        if(mov_dir === "left"){
            this.end_tile = this.start_tile - (col_count-1);
        }
        else if(mov_dir === "right") {
            this.end_tile = this.start_tile + (col_count-1);
        }
        else{
            console.log("Move Direction Not Specified");
        }
    }

    start_enemy(){
        game_map[this.start_tile].classList.add(this.enem_type);
        this.now_tile = this.start_tile;
        this.timer = setInterval(this.move_enemy.bind(this), this.speed);
        this.respawn_enem = 0;
    }

    respawn(){
        clearInterval(this.timer);
        this.respawn_enem = 1;
        game_map[this.now_tile_prev].classList.remove(this.enem_type);
        this.speed = this.get_randint();
        this.start_enemy();
    }

    move_enemy(){
        this.now_tile_prev = this.now_tile;
        if(this.direction === "left"){
            if(this.now_tile-1 >= this.end_tile){
                this.now_tile--;
            }

            else{
                // this.now_tile = this.start_tile;
                this.respawn();
            }
        }

        else if(this.direction === "right"){

            if(this.now_tile+1 <= this.end_tile){
                this.now_tile++;
            }

            else{
                // this.now_tile = this.start_tile;
                this.respawn();
            }
        }

        if(!this.respawn_enem){
            game_map[this.now_tile_prev].classList.remove(this.enem_type);
            game_map[this.now_tile].classList.add(this.enem_type);
        }  
    }

    get_randint(){
        let rand = 0;
        while(rand < 100){
            rand = Math.floor(Math.random()*1000);
        }
        return rand;
    }

    stop_npc(){
        clearInterval(this.timer);
    }
}

class Friend{
    start_tile = 0;
    end_tile = 0;
    now_tile = 0;
    now_tile_prev = 0;
    now_tile_prev_prev = 0;
    now_tile_prev_prev = 0;
    now_tile_prev_prev_prev = 0;
    direction = "";
    speed = 0;
    frnd_type = "";
    timer = 0;
    frnd_sec_ctr = 0;
    respawn_frnd = 0;
    user_found = 0;

    constructor(start_pos, mov_dir, frnd_type, frnd_name){
        this.start_tile = start_pos;
        this.direction = mov_dir;
        this.frnd_type = frnd_type;
        this.speed = this.get_randint();
        npcs.push(frnd_name);
    
        if(mov_dir === "left"){
            this.end_tile = this.start_tile - (col_count-1);
        }
        else if(mov_dir === "right") {
            this.end_tile = this.start_tile + (col_count-1);
        }
        else{
            console.log("Move Direction Not Specified");
        }
    }

    start_frnd(){
        game_map[this.start_tile].classList.add(this.frnd_type);
        this.now_tile = this.start_tile;
        this.timer = setInterval(this.move_frnd.bind(this), this.speed);
    }

    move_frnd(){
        this.now_tile_prev_prev_prev = this.now_tile_prev_prev;
        this.now_tile_prev_prev = this.now_tile_prev;
        this.now_tile_prev = this.now_tile;
        if(this.direction === "left"){
            if(this.now_tile-1 >= this.end_tile){
                this.now_tile--;
            }

            else{
                // this.now_tile = this.start_tile;
                this.frnd_sec_ctr++;
                if(this.frnd_sec_ctr == 4){
                    this.frnd_sec_ctr = 0;
                    this.respawn_frnd = 1;
                    this.now_tile = 0;
                    this.now_tile_prev = 0;
                    this.now_tile_prev_prev = 0;
                    this.now_tile_prev_prev_prev = 0;
                }
            }
        }

        else if(this.direction === "right"){

            if(this.now_tile+1 <= this.end_tile){
                this.now_tile++;
            }

            else{
                // this.now_tile = this.start_tile;
                this.frnd_sec_ctr++;
                if(this.frnd_sec_ctr == 4){
                    this.frnd_sec_ctr = 0;
                    this.respawn_frnd = 1;
                    this.now_tile = 0;
                    this.now_tile_prev = 0;
                    this.now_tile_prev_prev = 0;
                    this.now_tile_prev_prev_prev = 0;
                }
            }
        }
        game_map[this.now_tile].classList.add(this.frnd_type); 
        this.move_flwrs();
        
        if((this.now_tile === user_pos || this.now_tile_prev === user_pos || this.now_tile_prev_prev === user_pos || this.now_tile_prev_prev_prev === user_pos) && user_pos !== 0){
            this.carry_user();
        }

        if(this.respawn_frnd === 1){
            this.respawn();
        }
    }

    move_flwrs(){
        game_map[this.now_tile_prev_prev_prev].classList.remove(this.frnd_type);
    }

    carry_user(){

        user_pos_prev = user_pos;
        if((this.direction === "left") && (user_pos >= crow_min+1)){
            user_pos--;
        }

        else if((this.direction === "right") && (user_pos <= crow_max-1)){
            user_pos++;
        }

    game_map[user_pos_prev].classList.remove("user");
    game_map[user_pos].classList.add("user");
    }

    respawn(){
        clearInterval(this.timer);
        this.speed = this.get_randint();
        game_map[this.start_tile].classList.add(this.frnd_type);
        this.now_tile = this.start_tile;
        this.timer = setInterval(this.move_frnd.bind(this), this.speed);
        this.respawn_frnd = 0;
    }

    stop_npc(){
        clearInterval(this.timer);
    }

    get_randint(){
        let rand = 0;
        while(rand < 100){
            rand = Math.floor(Math.random()*1000);
        }
        return rand;
    }
}

user_init();
get_record();
start_btn.addEventListener("click", start_game);
reload_btn.addEventListener("click", function(){
    location.reload();
});

function start_game(){
    document.addEventListener("keydown", move_user);
    start_npcs();
    event_chk_tmr = setInterval(event_check, 50);   //influences the timer. Important
    start_btn.removeEventListener("click", start_game);
}

function event_check(){

    timer++;    //every 20 ticks means a second has passed
    // console.log(timer);

    npcs.forEach(function(npc){ //checking collisions with NPCs, wood is excempted
        if(window[npc].now_tile === user_pos && !npc.includes("wood")){
            collision();
        }
    });

    if(user_pos === 0 || user_pos === 2 || user_pos === 4 || user_pos === 6 || user_pos === 8 || user_pos === 10){  //trap at the end
        collision();
    }

    if(user_pos >= 48 && user_pos < 96){    //in water, if log is present then good
        river_ary = Array.from(game_map[user_pos].classList);
        if(!river_ary.includes("wood")){
            collision();
        }
    }

    if(user_pos === 1 || user_pos === 3 || user_pos === 5 || user_pos === 7 || user_pos === 9 || user_pos === 11){  //victory at the end
        score++;
        update_score();
        game_map[user_pos].classList.remove("dest-inacsbl");
        game_map[user_pos].classList.add("dest-done");
        game_map[user_pos].classList.remove("user");
        timer = 0;
        time_left = 30;
        user_init();
        if(score === 6){
            end_game();
        }
    }

    if(timer%20 === 0){ //counting seconds to display
        tmr_elem.textContent = time_left--;
    }

    if(timer === 600){  //30s to end life
         collision(); //reusing this function due to identical functionality
    }

}

function collision(){
    // console.log("You Died");   //reduce life, user at start pos & if life === 0 then game over
    game_map[user_pos].classList.remove("user");
    user_init();
    lives--;
    lvs_elem.textContent = lives;
    if(lives == 0){
        end_game();
    }
    timer = 0;
    time_left = 30;
}

function end_game(){
    document.removeEventListener("keydown", move_user);
    clearInterval(event_chk_tmr);
    stop_npc_all();
}

function update_score(){
    score_elem.textContent = score;
    if(score > record){
        update_record();
    }
}

function update_record(){
    rcrd_ary[1] = score;
    localStorage.setItem("frogger", JSON.stringify(rcrd_ary));
    get_record();
}

function get_record(){
    if(localStorage.getItem("frogger")){
        rcrd_ary = (JSON.parse(localStorage.getItem("frogger")));
        if(rcrd_ary[0] === "record"){
            record = parseInt(rcrd_ary[1]);
            rcrd_elem.textContent = record;
        }
    }
    else{
        rcrd_ary = ["record", 0];
    }
}

function start_npcs(){
    car_left_1 = new Enemy(131, "left", "car-l1", "car_left_1");
    car_left_1.start_enemy();
    car_left_2 = new Enemy(143, "left", "car-l2", "car_left_2");
    car_left_2.start_enemy();
    car_rght_1 = new Enemy(144, "right", "car-r1", "car_rght_1");
    car_rght_1.start_enemy();
    car_rght_2 = new Enemy(156, "right", "car-r2", "car_rght_2");
    car_rght_2.start_enemy();
    cyc_left = new Enemy(119, "left", "cyc-l", "cyc_left");
    cyc_left.start_enemy();
    cyc_rght = new Enemy(168, "right", "cyc-r", "cyc_rght");
    cyc_rght.start_enemy();
    pred_left = new Enemy(23, "left", "pred-l", "pred_left");
    pred_left.start_enemy();
    pred_rght = new Enemy(24, "right", "pred-r", "pred_rght");
    pred_rght.start_enemy();
    wood_left_1 = new Friend(59, "left", "wood", "wood_left_1");
    wood_left_1.start_frnd();
    wood_rght_1 = new Friend(60, "right", "wood", "wood_rght_1");
    wood_rght_1.start_frnd();
    wood_left_2 = new Friend(83, "left", "wood", "wood_left_2");
    wood_left_2.start_frnd();
    wood_rght_2 = new Friend(84, "right", "wood", "wood_rght_2");
    wood_rght_2.start_frnd();
}

function stop_npc_all(){
    npcs.forEach(function(npc){
        window[npc].stop_npc();
    });
}

function user_init(){
    user_pos = 186;
    user_pos_prev = 0;
    crow_min = Math.floor(user_pos/col_count)*12;
    crow_max = crow_min+col_count-1;
    const elem = document.getElementById("rp-30");
    elem.classList.add("user");
}

function move_user(event){
    user_pos_prev = user_pos;
    if(event.key === "ArrowUp"){
        if(user_pos >= game_map_mintile+col_count){
            user_pos = user_pos-col_count;
            crow_min = crow_min-col_count;
            crow_max = crow_max-col_count;
        }
        else{
            ;   //Don't move up if -12 will exceed 0
        }
    }
    else if(event.key === "ArrowDown"){
        if(user_pos <= game_map_maxtile-col_count){
            user_pos = user_pos+col_count;
            crow_min = crow_min+col_count;
            crow_max = crow_max+col_count;
        }
        else{
            ;   //Don't move down if +12 will exceed 191
        }
    }
    else if(event.key === "ArrowLeft"){
        if(user_pos >= crow_min+1){
            user_pos = user_pos-1;
        }
        else{
            ;   //Don't move left if -1 will exceed current row min
        }
    }
    else if(event.key === "ArrowRight"){
        if(user_pos <= crow_max-1){
            user_pos = user_pos+1;
        }
        else{
            ;   //Don't move right if +1 will exceed current row max
        }
    }
    else{
        // console.log("Function Works");   //Unprogrammed key pressed
    }
    // console.log(user_pos, crow_min, crow_max);
    game_map[user_pos_prev].classList.remove("user");
    game_map[user_pos].classList.add("user");
}