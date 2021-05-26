"use strict";

var canvas;
var gl;

var positions = [];
var WIDTH;
var LENGTH;
var maze;
//var visited;

var XORIGIN = -.9;
var YORIGIN = .9;

var SIZE;

var start0 = vec2(-.8, .9);
var start1 = vec2(-.75, .75);
var start2 = vec2(-.85, .75);

var vertices = [];

var v = [];
var all = [];

var translate = vec2(0, -.1);
var trans;
var theta = 0.0;
var thetaLoc;
var midpoint = vec2(0,0);
var midp;
var movement = vec2(0,0);


var initialmid;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }
    
    document.onkeydown = function(event){
        switch(event.keyCode){
            //up key
            case 38:
                console.log(JSON.parse(JSON.stringify(vertices)));
                
                
                var temp0 = add(vertices[0], translate);
                if(checkPoint(vertices[0], temp0) == false){   
                    
                    break;
                }
                
                var temp1 = add(vertices[1], translate);
                if(checkPoint(vertices[1], temp1) == false){   
                    
                    break;
                }
                
                var temp2 = add(vertices[2], translate);
                if(checkPoint(vertices[2], temp2) == false){   
                    
                    break;
                }
                
                vertices[0] = temp0;
                vertices[1] = temp1;
                vertices[2] = temp2;
                console.log(JSON.parse(JSON.stringify(vertices)));
             
                var p = mix(vertices[2], vertices[1], .5);
                var m2 = mix(vertices[0], p, 2/3);
                midpoint = initialmid;
                movement = add(movement, translate);
                theta = theta + 0;
                
                drawMaze();
                render();
                break;
            //right
            case 39:
                
                var p = mix(vertices[2], vertices[1], .5);
                var m2 = mix(vertices[0], p, 2/3);
                midpoint = initialmid;
                 //rotate points
                var temp0 = rotate(vertices[0][0], vertices[0][1], m2[0], m2[1], -10);               
                if(checkPoint(vertices[0], temp0) == false){
                    //console.log("her");
                
                    break;
                }
                
                var temp1 = rotate(vertices[1][0], vertices[1][1], m2[0], m2[1], -10);
                if(checkPoint(vertices[1], temp1) == false){
                    //console.log("hereee");
                    
                    break;
                }
                
                var temp2 = rotate(vertices[2][0], vertices[2][1], m2[0], m2[1], -10);
                if(checkPoint(vertices[2], temp2) == false){
                  
                    break;
                }
                vertices[0] = temp0;
                vertices[1] = temp1;
                vertices[2] = temp2;
                
                
                translate = rotate(translate[0], translate[1], 0, 0, -10);
                movement = add(movement, vec2(0,0));
                theta = theta + (Math.PI / 180) * -10;
                
                drawMaze();
                render();
                break;
            //left
            case 37:
                
                var p = mix(vertices[2], vertices[1], .5);
                var m2 = mix(vertices[0], p, 2/3);
                midpoint = initialmid;
                 //rotate points
                var temp0 = rotate(vertices[0][0], vertices[0][1], m2[0], m2[1], 10);  
                if(checkPoint(vertices[0], temp0) == false){
                    //console.log("her");
                    
                    break;
                }
                
                var temp1 = rotate(vertices[1][0], vertices[1][1], m2[0], m2[1], 10);
                if(checkPoint(vertices[1], temp1) == false){
                    //console.log("hereee");
                    
                    break;
                }
                
                var temp2 = rotate(vertices[2][0], vertices[2][1], m2[0], m2[1], 10);
                if(checkPoint(vertices[2], temp2) == false){
                    //console.log("herasds");
                    
                    break;
                }
                
                vertices[0] = temp0;
                vertices[1] = temp1;
                vertices[2] = temp2;
                
                
                translate = rotate(translate[0], translate[1], 0, 0, 10);
                movement = add(movement, vec2(0,0));
                theta = theta + (Math.PI / 180) * 10;
                
                drawMaze();
                render();
                break;
        }
    }
    //render();
};

function drawMaze(){
    gl.uniform1f(thetaLoc, 0);
    gl.uniform2fv(midp, vec2(0,0));
    gl.uniform2fv(trans, vec2(0,0));
    
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.LINES, 0, positions.length );
}

function render()
{
    gl.uniform1f(thetaLoc, theta);
    gl.uniform2fv(midp, midpoint);
    gl.uniform2fv(trans, movement);
    
    gl.drawArrays( gl.LINES, positions.length, all.length );
}

function initializeM(){
    WIDTH = document.getElementById("m").value;
    LENGTH = document.getElementById("n").value;
    console.log(WIDTH);
    SIZE = Math.max(1.9/WIDTH, 1.9/LENGTH);
    
    initializeRat();
    generateMaze();
    all = positions.concat(v);
    
    var initialp = mix(vertices[2], vertices[1], .5);
    var initialm2 = mix(vertices[0], initialp, 2/3);
    initialmid = initialm2;
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram(program);

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(all), gl.STATIC_DRAW );


    // Associate out shader variables with our data buffer

    var positionLoc = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( positionLoc, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( positionLoc );
    
    thetaLoc = gl.getUniformLocation(program, "uTheta");
    midp = gl.getUniformLocation(program, "midpoint");
    trans = gl.getUniformLocation(program, "translate");
    
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.LINES, 0, all.length );
}

function generateMaze(){

    positions = [];
    
    //WIDTH = 3;
    //LENGTH = 2;
    
    var m = initializeMaze(WIDTH, LENGTH, [1,1,1,1,false]);
    
    //console.log(JSON.parse(JSON.stringify(m)));
    var visited = [WIDTH];
    for(let i = 0; i < WIDTH; i++) {
        visited[i] = [].slice();
        for(let j = 0; j < LENGTH; j++) {
            visited[i][j] = false;
        }
    }
    
    maze = [];
    maze = newMaze(m, visited);
    console.log(JSON.parse(JSON.stringify(maze)));
    maze[0][0][0] = 0;
    maze[WIDTH-1][LENGTH-1][1] = 0;
    
    for(var i = 0; i < WIDTH; i++){
        for(var j = 0; j < LENGTH; j++){
            //north wall
            if(maze[i][j][0] == 1){
                wall(i, j, 1);
            }
            //south
            if(maze[i][j][1] == 1){
                wall(i, j+1, 1);
            }
            //east
            if(maze[i][j][2] == 1){
                wall(i+1, j, 0);
            }
            //west
            if(maze[i][j][3] == 1){
                wall(i,j,0);
            }
        }
    }
}

function checkPoint(before, p){
    for(var i = 0; i < WIDTH; i++){
        for(var j = 0; j < LENGTH; j++){
            //check north wall
            if(maze[i][j][0] == 1){
                var firstPoint = getPoint(i, j);
                var secondPoint = add(firstPoint, vec2(SIZE, 0));
                //console.log(before, p, firstPoint, secondPoint);
                if(p[0] >= firstPoint[0] && p[0] <= secondPoint[0]){
                    if(before[1] <= firstPoint[1] && p[1] >= firstPoint[1]){
                        return false;
                    }
                }
            }
            //check west wall
            if(maze[i][j][3] == 1){
                var firstPoint = getPoint(i, j);
                var secondPoint = add(firstPoint, vec2(0, -SIZE));
                if(p[1] <= firstPoint[1] && p[1] >= secondPoint[1]){
                    if(before[0] >= firstPoint[0] && p[0] <=secondPoint[0]){
                        return false;
                    }
                }
            }
            //check south wall
            if(maze[i][j][1] == 1){
                var firstPoint = getPoint(i, j+1);
                var secondPoint = add(firstPoint, vec2(SIZE, 0));
                if(p[0] >= firstPoint[0] && p[0] <= secondPoint[0]){
                    if(before[1] >= firstPoint[1] && p[1] <= firstPoint[1]){
                        return false;
                    }
                }
            }
            //check east wall
            if(maze[i][j][2] == 1){
                var firstPoint = getPoint(i+1, j);
                var secondPoint = add(firstPoint, vec2(0, -SIZE));
                if(p[1] <= firstPoint[1] && p[1] >= secondPoint[1]){
                    if(before[0] <= firstPoint[0] && p[0] >=secondPoint[0]){
                        return false;
                    }
                }
            }
        }
    }
    return true;
}

function rotate(x, y, cx, cy, angle){
    var radians = (Math.PI / 180) * angle;
    var cos = Math.cos(radians);
    var sin = Math.sin(radians);
    var nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
    var ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return vec2(nx, ny);
}

function initializeRat(){
    translate = vec2(0, -.01);
    
    var p1 = vec2(XORIGIN, YORIGIN);
    var p2 = add(p1, vec2(SIZE, 0));
    
    var c0 = mix(p1, p2, 1/3);
    var c1 = mix(p1, p2, 2/3);
    var c2 = mix(p1, p2, 1/2);
    c2 = add(c2, vec2(0, -SIZE*1/3));
    
    vertices = [];
    vertices.push(c0);
    vertices.push(c1);
    vertices.push(c2);
    
    v.push(vertices[0], vertices[1]);
    v.push(vertices[1], vertices[2]);
    v.push(vertices[2], vertices[0]);
}

function newMaze(m, v) {
    
    var maze = m;
    var visited = v;
    
    console.log(JSON.parse(JSON.stringify(maze)));
    var back = [];
    
    var x = 0;
    var y = 0;
    back.push(x);
    back.push(y);
  

    //while stack is not empty
    while(back.length > 0){
        //console.log(back.length);
        y = back.pop();
        x = back.pop();
        
        maze[x][y][4] = true;
        //visited[x][y] = true;
        //console.log(x, y);
        //check that it has unvisited neighbors
        if(y == 0 || (y-1 >= 0 && maze[x][y-1][4] == true)){
            if(y == LENGTH-1 || (y+1 < LENGTH && maze[x][y+1][4] == true)){
                if(x == 0 || (x-1 >= 0 && maze[x-1][y][4] == true)){
                    if(x == WIDTH-1 || (x+1 < WIDTH && maze[x+1][y][4] == true)){
                            continue;
                    }
                }
            }
        }
        
        var picked = false;
        while(picked == false){
            var dir = Math.floor(Math.random() * 4);
            //north
            if(dir == 0){
                if(y-1 >= 0 && maze[x][y-1][4] == false){
                    maze[x][y][0] = 0;
                    maze[x][y-1][1] = 0;
                    back.push(x);
                    back.push(y);
                    back.push(x);
                    back.push(y-1);
                    picked = true;
                }
            //south
            }else if(dir == 1){
                if(y+1 < LENGTH && maze[x][y+1][4] == false){
                    maze[x][y][1] = 0;
                    maze[x][y+1][0] = 0;
                    back.push(x);
                    back.push(y);
                    back.push(x);
                    back.push(y+1);
                    picked = true;
                }
                //east
            }else if(dir == 2){
                if(x+1 < WIDTH && maze[x+1][y][4] == false){
                    maze[x][y][2] = 0;
                    maze[x+1][y][3] = 0;
                    back.push(x);
                    back.push(y);
                    back.push(x+1);
                    back.push(y);
                    picked = true;
                }
            //west
            }else if(dir == 3){
                if(x-1 >= 0 && maze[x-1][y][4] == false){
                    maze[x][y][3] = 0;
                    maze[x-1][y][2] = 0;
                    back.push(x);
                    back.push(y);
                    back.push(x-1);
                    back.push(y);
                    picked = true;
                }
            }
        }
    }
    console.log(JSON.parse(JSON.stringify(maze)));
    //console.log(JSON.parse(JSON.stringify(visited)));
    return maze;
}

function initializeMaze(w, l, val){
    var m = [w];
    for(let i = 0; i < w; i++) {
        m[i] = [].slice();
        for(let j = 0; j < l; j++) {
            //[north][south][east][west]
            m[i][j] = val.slice();
        }
    }
    
    return m;
}

function wall(i, j, d){
    var r, c;
    //west wall
    if(d == 0){
        r = i;
        c = j;                
        var firstPoint = getPoint(i , j);
        var secondPoint = add(firstPoint, vec2(0, -SIZE));
        positions.push(firstPoint);
        positions.push(secondPoint);
        //console.log(r,c, firstPoint, secondPoint);

    //north wall
    }else{
        r = i;
        c = j;
        var firstPoint = getPoint(i, j);
        var secondPoint = add(firstPoint, vec2(SIZE, 0));
        positions.push(firstPoint);
        positions.push(secondPoint);
        //console.log(r,c, firstPoint, secondPoint);
    }
}

function getPoint(i, j){
    var x = XORIGIN + i * SIZE;
    var y = YORIGIN - j * SIZE;
    return vec2(x, y);
}
