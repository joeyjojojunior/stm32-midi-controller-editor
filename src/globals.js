const {
    read
} = require("original-fs");

// Global variables
const MAX_LABEL_CHARS = 14;
const NUM_COLS = 16;
const NUM_ROWS = 4;
const NUM_KNOBS = 128;

var mode = "knob";