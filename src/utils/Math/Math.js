module.exports = class MathLab{
    length(x1, y1, x2 ,y2){
        return Math.sqrt(Math.pow((x2-x1), 2) + Math.pow((y2-y1), 2));
    }
    isLongerThanRadius(x1, y1, x2, y2, r){
        return this.length(x1, y1, x2, y2) > r; //expectation false
    }
} 