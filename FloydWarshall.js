var Data;
var visited = [];
var totalPath = [];
var found = false;

// Implementing Floyd-Warshall Visualization
export function FloydWarshall(arrayData, startNode, endNode, SPEED) {
    // Initialization
    Data = new Array(2);
    Data = arrayData;
    visited = [];
    totalPath = [];
    found = false;

    let f1 = false, f2 = false;
    for (let i = 0; i < Data.length; i++) {
        for (let j = 0; j < Data.length; j++) {
            if (Data[i][j].id == startNode) {
                startNode = Data[i][j];
                f1 = true;
            }
            if (Data[i][j].id == endNode) {
                endNode = Data[i][j];
                f2 = true;
            }
        }
        if (f1 && f2) break;
    }

    FloydWarshallAlgorithm(Data, startNode, endNode, totalPath, visited);

    for (var i = 0; i < visited.length; i++) {
        let x = visited[i];
        if (x != endNode.id) {
            setTimeout(function () {
                $("#" + x).addClass("animate");
            }, (i + 1) * 20 * SPEED);
        }
    }

    if (!found) {
        setTimeout(function () {
            alert("No Path Found");
            enableControls();
        }, (i + 2) * 20 * SPEED);
    } else {
        FloydWarshallPath(totalPath, i, visited.length, SPEED);
    }
}

function FloydWarshallAlgorithm(Data, startNode, endNode, totalPath, visited) {
    let dist = {};
    let next = {};

    for (let i = 0; i < Data.length; i++) {
        for (let j = 0; j < Data[i].length; j++) {
            let node = Data[i][j];
            dist[node.id] = {};
            next[node.id] = {};

            for (let k = 0; k < Data.length; k++) {
                for (let l = 0; l < Data[k].length; l++) {
                    let other = Data[k][l];
                    dist[node.id][other.id] = (node.id === other.id) ? 0 : Infinity;
                }
            }

            for (let neighbor of node.neighbors) {
                dist[node.id][neighbor.id] = 1;
                next[node.id][neighbor.id] = neighbor.id;
            }
        }
    }

    for (let k in dist) {
        for (let i in dist) {
            for (let j in dist) {
                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                    next[i][j] = next[i][k];
                    visited.push(j);
                }
            }
        }
    }

    if (next[startNode.id][endNode.id] !== undefined) {
        found = true;
        let u = startNode.id;
        while (u !== endNode.id) {
            totalPath.push(u);
            u = next[u][endNode.id];
        }
    }
}

function FloydWarshallPath(path, frames, nodes, speed) {
    for (var i = 0; i < path.length; i++) {
        let x = path[i];
        setTimeout(function () {
            $("#" + x).addClass("path");
        }, ++frames * 20 * speed);
    }

    setTimeout(function () {
        alert("Path Found\nDistance: " + path.length + "\nNodes visited: " + nodes);
        enableControls();
    }, (++frames + 2) * 20 * speed);
}

function enableControls() {
    $("#wall, #clear, #size, #speed, #start").removeAttr('disabled');
}
