#!/usr/bin/env node
module.exports = streams;

const minimist = require('minimist');
const fs = require('fs');
const program = require('commander');
const csvtojson = require('csvtojson');
const axios = require('axios');

function streams(settings) {

};

const reverse = str => str.split("").reverse().join("");

const transform = str => str.toUpperCase();

const outputFile = filePath => {
    return fs.readFileSync(filePath, 'utf-8');
};

const convertFromFile = filePath => {
    const readStream = fs.createReadStream(filePath, 'utf-8');
    readStream.pipe(csvtojson({noheader:true})).pipe(process.stdout);
};

const convertToFile = (filePath, outputFile) => {
    const readStream = fs.createReadStream(filePath, 'utf-8');
    const newFileName = filePath.split('.')[0] + '.json';
    const writeStream = fs.createWriteStream(newFileName, 'utf-8');
    readStream.pipe(csvtojson({noheader:true})).pipe(writeStream);
};

const cssBundle = (dirPath, fileName) => {
    const dirContent = fs.readdirSync(dirPath);
    const streams = dirContent.map(file => {
         return fs.createReadStream(dirPath + file)
    });
    const outputStream = fs.createWriteStream(dirPath + fileName);
    streams.forEach(stream => {
        stream.pipe(outputStream);
    });
    axios({
        method:'post',
        url:'https://epa.ms/nodejs18-hw3-css',
        responseType:'stream'
    })
    .then(
        (response) => response.data.pipe(outputStream),
        (e) => {console.log(e)}
    );
}   

const writeToConsole = str => process.stdout.write(str);


program
    .version('0.0.1', '-v --version')
    .description('supported actions: reverse, transform, outputFile, convertFromFile, convertToFile')
    .option('-a, --action <actionParam>', 'add action name')
    .option('-f, --file <fileParam>', 'add file name')
    .option('-p, --path <pathParam>', 'add path to directory')
    .parse(process.argv);

switch (program.action) {
    case 'reverse':
        writeToConsole(reverse(program.args[0]));
        break;

    case 'transform':
        writeToConsole(transform(program.args[0]));
        break;

    case 'outputFile':
        writeToConsole(outputFile(program.file));
        break;

    case 'convertFromFile':
        convertFromFile(program.file);
        break;

    case 'convertToFile':
        convertToFile(program.file);
        break;
    
    case 'cssBundle':
        cssBundle(program.path, 'biggundle.css');
        break;
    default:
        process.stdout.write('No such action');
        break;

}