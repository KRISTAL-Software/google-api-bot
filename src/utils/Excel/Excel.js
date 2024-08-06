const xlsx = require('xlsx');
const fs = require('fs');
class Excel 
{
    constructor(path)
    {
        this.path = path;
        this.file = this.fileInit(path);
    }

    fileInit(path)
    {
        if(fs.existsSync(path))
            return xlsx.readFile(path);
       else {
            const newWorkbook = xlsx.utils.book_new();
            xlsx.writeFile(newWorkbook, path);
            return newWorkbook;
        }
    }

    getFile()
    {
        return this.file;
    }

    workSheets ()
    {
        return this.file.Sheets;
    }

    sheetNames ()
    {
        return this.file.SheetNames;
    }

    workBook()
    {
        return this.file.Workbook;
    }

    sheet(name)
    {
        if(this.file.SheetNames.includes(name))
            return xlsx.utils.sheet_to_json(this.file.Sheets[name]);
        return null;
    }

    addSheet(sheetName, sheetJsonArray) {
        if (!sheetName || this.file.SheetNames.length >= 0xFFFF) throw new Error("Too many worksheets");
        const newSheet = xlsx.utils.json_to_sheet(sheetJsonArray);
        xlsx.utils.book_append_sheet(this.file, newSheet, sheetName);
        xlsx.writeFile(this.file, this.path);
    }

    getAllSheetsData() {
        const allData = [];
        this.file.SheetNames.forEach(sheetName => {
            const sheet = this.file.Sheets[sheetName];
            const sheetData = xlsx.utils.sheet_to_json(sheet, { defval: '' });
            allData.push(...sheetData);
        });
        return allData;
    }

    getSheetData(sheetName) {
        if (!this.file.Sheets[sheetName]) {
            throw new Error(`Sheet with name ${sheetName} does not exist`);
        }
        const sheet = this.file.Sheets[sheetName];
        return xlsx.utils.sheet_to_json(sheet, { defval: '' });
    }

    searchRow(sheetName, searchCriteria, value) {
        const sheetData = this.getSheetData(sheetName);
        let data = null;
        sheetData.filter(row => {
            if (row[searchCriteria] === value)
                data =  row;
        });
        return data;
    }

    newWorkbook()
    {
        return xlsx.utils.book_new();
    }

    sheetHeaders(sheetName)
    {
        return Object.keys(xlsx.utils.sheet_to_json(this.file.Sheets[sheetName])[0]);
    }

    createSheetFromHeader(headerArray) {
        const worksheet = xlsx.utils.aoa_to_sheet([headerArray]);
        return worksheet;
    }
}



module.exports = Excel;