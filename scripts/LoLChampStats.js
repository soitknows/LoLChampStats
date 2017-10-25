(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
        var cols = [{ id: "version", dataType: tableau.dataTypeEnum.string, alias: "Patch Version" },
                    { id: "id", dataType: tableau.dataTypeEnum.string, alias: "Champion Id" },
                    { id: "name", dataType: tableau.dataTypeEnum.string, alias: "Champion Name" },
                    { id: "partype", dataType: tableau.dataTypeEnum.string, alias: "Par Type" },
                    { id: "tag1", dataType: tableau.dataTypeEnum.string, alias: "Role 1" },
                    { id: "tag2", dataType: tableau.dataTypeEnum.string, alias: "Role 2" },
                    { id: "armor", dataType: tableau.dataTypeEnum.float, alias: "Armor" },
                    { id: "armorperlevel", dataType: tableau.dataTypeEnum.float, alias: "Armor per Level" },
                    { id: "attackdamage", dataType: tableau.dataTypeEnum.float, alias: "Attack Damage" },
                    { id: "attackdamageperlevel", dataType: tableau.dataTypeEnum.float, alias: "Attack Damage per Level" },
                    { id: "attackrange", dataType: tableau.dataTypeEnum.float, alias: "Attack Range" },
                    { id: "attackspeedoffset", dataType: tableau.dataTypeEnum.float, alias: "Attack Speed Offset" },
                    { id: "attackspeedperlevel", dataType: tableau.dataTypeEnum.float, alias: "Attack Spped per Level" },
                    { id: "crit", dataType: tableau.dataTypeEnum.float, alias: "Critical Strike" },
                    { id: "critperlevel", dataType: tableau.dataTypeEnum.float, alias: "Critical Strike per Level" },
                    { id: "hp", dataType: tableau.dataTypeEnum.float, alias: "Health" },
                    { id: "hpperlevel", dataType: tableau.dataTypeEnum.float, alias: "Health per Level" },
                    { id: "hpregen", dataType: tableau.dataTypeEnum.float, alias: "Health Regen" },
                    { id: "hpregenperlevel", dataType: tableau.dataTypeEnum.float, alias: "Health Regen per Level" },
                    { id: "movespeed", dataType: tableau.dataTypeEnum.float, alias: "Movement Speed" },
                    { id: "mp", dataType: tableau.dataTypeEnum.float, alias: "Mana Pool" },
                    { id: "mpperlevel", dataType: tableau.dataTypeEnum.float, alias: "Mana Pool per Level" },
                    { id: "mpregen", dataType: tableau.dataTypeEnum.float, alias: "Mana Pool Regen" },
                    { id: "mpregenperlevel", dataType: tableau.dataTypeEnum.float, alias: "Mana Pool Regen per Level" },
                    { id: "spellblock", dataType: tableau.dataTypeEnum.float, alias: "Magic Resist" },
                    { id: "spellblockperlevel", dataType: tableau.dataTypeEnum.float, alias: "Magic Resist per Level" }];

        var tableSchema = {
            id: "LoLChampFeed",
            alias: "League of Legends - Static Champion Stats",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    myConnector.getData = function(table, doneCallback) {
        var url_beg = "http://ddragon.leagueoflegends.com/cdn/",
            url_end = "/data/en_US/champion.json";
            tableData = [];

        var patches = JSON.parse(tableau.connectionData).patches;
        var count = patches.length;

        patches = patches.map( function(item) {
            var url = url_beg + item + url_end;
            $.getJSON(url, function(resp) {
                var data = resp.data;
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
                next();
            });
        });
        
        // Wait until all patches have been loaded before appending data.
        function next(){
            count--
            if(count < 1){
                table.appendRows(tableData);
                doneCallback();
            };
        }; 
    };
    tableau.registerConnector(myConnector);
})();


$(document).ready(function () {
    // Get patch versions from Data Dragon API and append to web form pick list.
    var patch_url = "https://ddragon.leagueoflegends.com/api/versions.json";
    $.getJSON(patch_url, function(resp){
        for (var i = 0; i < resp.length; i+= 1) {
           if (!_.includes(resp[i], "lolpatch")) { 
                $("#patches").append($("<option>",{
                    value: resp[i],
                    text: resp[i]
                }))
           };   
        };
    });

    $("#submitButton").click(function () {
        // Get selected patch versions from web form.
        var patches = [];
        $('#patches :selected').each( function () { 
            patches.push($(this).text()) 
        });

        // Store patches in connection data object to build url in myConnector.getData.
        var conn_data = {
            patches: patches,
        };

        tableau.connectionData = JSON.stringify(conn_data);
        tableau.connectionName = "LoL Champ Stats";
        tableau.submit();
    });
});
