(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
        var cols = [{ id: "version", dataType: tableau.dataTypeEnum.string, alias: "Patch Version" },
                    { id: "id", dataType: tableau.dataTypeEnum.string, alias: "Champion Id" },
                    { id: "name", dataType: tableau.dataTypeEnum.string, alias: "Champion Name" },
                    { id: "partype", dataType: tableau.dataTypeEnum.string, alias: "" },
                    { id: "tag1", dataType: tableau.dataTypeEnum.string },
                    { id: "tag2", dataType: tableau.dataTypeEnum.string },
                    { id: "armor", dataType: tableau.dataTypeEnum.float },
                    { id: "armorperlevel", dataType: tableau.dataTypeEnum.float },
                    { id: "attackdamage", dataType: tableau.dataTypeEnum.float },
                    { id: "attackdamageperlevel", dataType: tableau.dataTypeEnum.float },
                    { id: "attackrange", dataType: tableau.dataTypeEnum.float },
                    { id: "attackspeedoffset", dataType: tableau.dataTypeEnum.float },
                    { id: "attackspeedperlevel", dataType: tableau.dataTypeEnum.float },
                    { id: "crit", dataType: tableau.dataTypeEnum.float },
                    { id: "critperlevel", dataType: tableau.dataTypeEnum.float },
                    { id: "hp", dataType: tableau.dataTypeEnum.float },
                    { id: "hpperlevel", dataType: tableau.dataTypeEnum.float },
                    { id: "hpregen", dataType: tableau.dataTypeEnum.float },
                    { id: "hpregenperlevel", dataType: tableau.dataTypeEnum.float },
                    { id: "movespeed", dataType: tableau.dataTypeEnum.float },
                    { id: "mp", dataType: tableau.dataTypeEnum.float },
                    { id: "mpperlevel", dataType: tableau.dataTypeEnum.float },
                    { id: "mpregen", dataType: tableau.dataTypeEnum.float },
                    { id: "mpregenperlevel", dataType: tableau.dataTypeEnum.float },
                    { id: "spellblock", dataType: tableau.dataTypeEnum.float },
                    { id: "spellblockperlevel", dataType: tableau.dataTypeEnum.float }];

        var tableSchema = {
            id: "LoLChampFeed",
            alias: "League of Legends Static Champion Stats",
            columns: cols
    };

    schemaCallback([tableSchema]);
    };


    myConnector.getData = function(table, doneCallback) {
        var url = JSON.parse(tableau.connectionData).url;
        $.getJSON(url, function(resp) {
            var data = resp.data,
                tableData = [];
        
            // Get champion list.   
            var champs = [];
            for (var key in data) champs.push(key);

            // Iterate through data using champion names as keys.
            for (var i = 0, len = champs.length; i < len; i++) {
                tableData.push({
                    "version": data[champs[i]].version,
                    "id": data[champs[i]].key,
                    "name": data[champs[i]].name,
                    "partype": data[champs[i]].partype,
                    "tag1": data[champs[i]].tags[0],
                    "tag2": data[champs[i]].tags[1],
                    "armor": data[champs[i]].stats.armor,
                    "armorperlevel": data[champs[i]].stats.armorperlevel,
                    "attackdamage": data[champs[i]].stats.attackdamage,
                    "attackdamageperlevel": data[champs[i]].stats.attackdamageperlevel,
                    "attackrange": data[champs[i]].stats.attackrange,
                    "attackspeedoffset": data[champs[i]].stats.attackspeedoffset,
                    "attackspeedperlevel": data[champs[i]].stats.attackspeedperlevel,
                    "crit": data[champs[i]].stats.crit,
                    "critperlevel": data[champs[i]].stats.critperlevel,
                    "hp": data[champs[i]].stats.hp,
                    "hpperlevel": data[champs[i]].stats.hpperlevel,
                    "hpregen": data[champs[i]].stats.hpregen,
                    "hpregenperlevel": data[champs[i]].stats.hpregenperlevel,
                    "movespeed": data[champs[i]].stats.movespeed,
                    "mp": data[champs[i]].stats.mp,
                    "mpperlevel": data[champs[i]].stats.mpperlevel,
                    "mpregen": data[champs[i]].stats.mpregen,
                    "mpregenperlevel": data[champs[i]].stats.mpregenperlevel,
                    "spellblock": data[champs[i]].stats.spellblock,
                    "spellblockperlevel": data[champs[i]].stats.spellblockperlevel
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);
})();


$(document).ready(function () {
//  Get list of patches and append them to pick list in #patches form.
    var patch_url = "https://ddragon.leagueoflegends.com/api/versions.json";
    $.getJSON(patch_url, function(resp){
        for (var i = 0; i < resp.length; i+= 1) {
           // if (!resp[i].includes("lolpatch")) { 
           //      $("#patches").append($("<option>",{
           //          value: resp[i],
           //          text: resp[i]
           //      }))
           // }; 

           // Testing
            $("#patches").append($("<option>",{
                value: resp[i],
                text: resp[i]
            }));
        };
    });

    $("#submitButton").click(function () {
        var patch = $('#patches :selected').text();
        var url = "http://ddragon.leagueoflegends.com/cdn/" + patch + "/data/en_US/champion.json";
        var submission = {
            patch: patch,
            url: url
        };

        tableau.connectionData = JSON.stringify(submission);
        tableau.connectionName = "LoL Champ Stats";
        tableau.submit();
    });
});
