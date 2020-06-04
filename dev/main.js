
let state;
let turnOf;

const play = function(origin, destiny){
    const res = state.playMove(origin, destiny, turnOf);
    if (res.valid){
        turnOf = turnOf == ChessState.player.WHITE ?
        ChessState.player.BLACK : ChessState.player.WHITE;
    } else {
        console.log(res.message);
    }
    draw();
}

const start = function(){
    loadSprites();
    state = new ChessState();
    turnOf = ChessState.player.WHITE;
    setTimeout(() => {
        draw();
    }, 500);
}

const draw = function(){
    state.getBoardImageBuffer(
        // turnOf == ChessState.player.BLACK
    );
    // requestAnimationFrame(draw);
}

const loadSprites = function(){
    const loadImage = function(url, callback){
        const req = new XMLHttpRequest();
        // req.open("GET", url, true);
        // req.onload = function(){
        //     if (req.status != 200){
        //         callback("Could not load from " + url, null);
        //     } else {
        //         callback(null, req);
        //     }
        // }
        // req.send();
        const img = new Image();
        img.src = url;
        img.onload = function(){
            if (!img.complete){
                callback("Could not load from " + url, null);
            } else {
                callback(null, img);
            }
        }
    }

    for (let p of Object.keys(pieces)){
        loadImage(
            `sprites/white-${
                pieces[p].name
            }.png`,
            function(err, image){
                if (err){
                    throw Error(err);
                }
                pieces[p].sprites.white = image;
            }
        )
        loadImage(
            `sprites/black-${
                pieces[p].name
            }.png`,
            function(err, image){
                if (err){
                    throw Error(err);
                }
                pieces[p].sprites.black = image;
            }
        );
    }
}
