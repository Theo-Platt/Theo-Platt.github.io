socket = io();
debug=false
numRows=100
numCols=100
role = undefined

// Direction Enum
direction = {
    UP:    "up",
    DOWN:  "down",
    LEFT:  "left",
    RIGHT: "right",
    NONE:  "none"
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

