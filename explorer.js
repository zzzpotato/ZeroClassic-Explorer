// Search
$(document).ready(function() {
    $("#search").on("submit", function(e) {
        e.preventDefault();
 
        // Search
        if(!isNaN($("#query").val()) && fetchBlockHash($("#query").val()) != false) {
            // Block Number
            window.location.replace('?block='+fetchBlockHash($("#query").val()));
        } else if ($("#query").val().startsWith('t1') && validateAddress($("#query").val())){
            // Address
            window.location.replace('?address='+$("#query").val());
        } else {
            // Check if block or tx
            if(validateBlockHash($("#query").val())) {
                // Block Hash
                window.location.replace('?block='+$("#query").val());
            } else if (validateTxHash($("#query").val())) {
                // Tx Hash
                window.location.replace('?tx='+$("#query").val());
            } else {
                // Invalid search
                swal({
                    title: 'Your search was invalid!',
                    icon: 'error',
                    showConfirmButton: false,
                    showCloseButton: false,
                });
            }
        }
    })
});

// Truncate long strings
text_truncate = function(str, length, ending) {
    if (length == null) {
        length = 100;
    }
    if (ending == null) {
        ending = '...';
    }
    if (str.length > length) {
        return str.substring(0, length - ending.length) + ending;
    } else {
        return str;
    }
};

// Validate block hash
function validateAddress(addr) {
    var returnValue = "";
    $.ajax({
        async: false,
        url: '' + explorerAPI + 'addr/'+addr+'?noTxList=1',
        dataType: 'json',
        error: function() {
            returnValue = false;
        },
        success: function(data) {
            returnValue = true;
        }
    });
    return returnValue;
}

// Validate block hash
function validateBlockHash(blockhash) {
    var returnValue = "";
    $.ajax({
        async: false,
        url: '' + explorerAPI + 'block/'+blockhash,
        dataType: 'json',
        error: function() {
            returnValue = false;
        },
        success: function(data) {
            returnValue = true;
        }
    });
    return returnValue;
}

// Validate tx hash
function validateTxHash(txid) {
    var returnValue = "";
    $.ajax({
        async: false,
        url: '' + explorerAPI + 'tx/'+txid,
        dataType: 'json',
        error: function() {
            returnValue = false;
        },
        success: function(data) {
            returnValue = true;
        }
    });
    return returnValue;
}

// Fetch current height
var update = function currBlockHeight() {
    $(document).ready(function() {
        $.ajax({
            async: false,
            url: '' + explorerAPI + 'status?q=getInfo',
            dataType: 'json',
            error: function() {
                swal({
                    title: 'Oh no!',
                    icon: 'warning',
                    text: 'We are having trouble connecting to the explorer...',
                    showConfirmButton: false,
                    showCloseButton: false,
                });
            },
            success: function(data) {
                let height = data.info.blocks;
                $(".currHeight").text(height);

                //Sync Status
                $.ajax({
                    async: false,
                    url: '' + explorerAPI + 'sync',
                    dataType: 'json',
                    error: function() {
                        swal({
                            title: 'Oh no!',
                            icon: 'warning',
                            text: 'We are having trouble connecting to the explorer...',
                            showConfirmButton: false,
                            showCloseButton: false,
                        });
                    },
                    success: function(data) {
                        if ( data.syncPercentage != 100) {
                            swal({
                                title: 'Hold on a sec...',
                                icon: 'info',
                                text: 'The explorer is not fully synced!\n\nCurrent height is '+data.height+' ('+data.syncPercentage+'%)',
                                showConfirmButton: false,
                                showCloseButton: false,
                            });
                        }    
                    }
                });

            }
        });
    });
}
update();
var refInterval = window.setInterval('update()', 120000);

// Fetch home stats
function homeStats(_cgID, fetchMarket) {
    $(document).ready(function() {
        var getInfo = $.ajax({
            async: false,
            url: '' + explorerAPI + 'status?q=getInfo',
            dataType: 'json',
            error: function() {
                //alert("We are having trouble connecting to the explorer right now...");
            },
            success: function(data) {
                let height = data.info.blocks;
                $(".homeNetworkSols").text(data.info.networksolps);
                $(".homeVersion").text(data.info.version);
                $(".homeProtocolVersion").text(data.info.protocolversion);
                $(".homeBlocks").text(data.info.blocks);
                $(".homeConnections").text(data.info.connections);
                $(".homeDifficulty").text(data.info.difficulty);
                $(".homeTestnet").text(data.info.testnet);
                $(".homeTotalSupply").text((data.info.blocks*10));

                if (fetchMarket == true || fetchMarket != undefined) {
                    function numberWithCommas(x) {
                        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    }

                    function priceChange(val, day) {
                        $('.price-change'+day).each(function() {
                            $(this).addClass(val < 0 ? 'fa-level-down' : 'fa-level-up');
                            $(this).addClass(val < 0 ? 'text-danger' : 'text-info');
                        });
                        //return parseFloat(val.toString().substr(0,5));
                    }

                    function fetchMarketStats(_cgID, height) {
                        $.ajax({
                            url: 'https://api.coingecko.com/api/v3/coins/'+_cgID+'?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true',
                            dataType: 'json',
                            success: function (data) {

                                var usd = data.market_data.current_price.usd;
                                var btc = data.market_data.current_price.btc;
                                var eth = data.market_data.current_price.eth;
                                var eur = data.market_data.current_price.eur;

                                //USD | BTC
                                //1hr | 24 hr
                                //volume symbol

                                $(".usdprice").text(usd.toFixed(3));
                                $(".eurprice").text(eur.toFixed(3));
                                $(".btcprice").text(btc.toFixed(8));
                                $(".ethprice").text(eth.toFixed(8));

                                $(".btc24hr").text(priceChange(data.market_data.price_change_percentage_24h, 24));
                                $(".btc7d").text(priceChange(data.market_data.price_change_percentage_7d, 7));
                                $(".btc30d").text(priceChange(data.market_data.price_change_percentage_30d, 30));

                                $(".btcvolume").text(numberWithCommas(data.market_data.total_volume.btc.toFixed(4)));
                                $(".usdvolume").text(numberWithCommas(data.market_data.total_volume.usd.toFixed(2)));

                                $(".marketCap").text((usd*height*10).toFixed(3));

                            },
                            error: function() {
                                swal({
                                    title: 'Well, this is awkward',
                                    icon: 'warning',
                                    text: 'We are having trouble connecting to Coin Gecko...',
                                    showConfirmButton: false,
                                    showCloseButton: false,
                                });
                            }
                        });
                    }

                    fetchMarketStats(_cgID, height);
                }
            }
        });
    });
}

// Fetch latest blocks table
function fetchLatestBlocks() {
    $(document).ready(function() {
        var blockList = $('#blockList').dataTable( {
            autoWidth: true,
            searching: true,
            ordering: false,
            responsive: true,
            lengthChange: true,
            processing: true,
            stateSave: true,
            ajax: {
                url: '' + explorerAPI + 'blocks',
                dataSrc: function ( json ) {
                    for ( var i=0;i<json.blocks.length; i++ ) {
                        json.blocks[i]['height'] = "<a class=\"text-primary\" href='?block=" + json.blocks[i]['hash'] + "'>" + json.blocks[i]['height'] + "</a>";
                        json.blocks[i]['time'] = new Date((json.blocks[i]['time']) * 1000).toUTCString();
                        json.blocks[i]['txlength'];

                        var poolInfo = json.blocks[i]['poolInfo']
                        Object.keys(poolInfo).forEach(function (pool) {
                            //
                        });

                        json.blocks[i]['poolName'] = "<a href='"+ poolInfo.url + "'>" + poolInfo.poolName + "</a>";
                        json.blocks[i]['size'];
                    }
                    return json.blocks;
                }
            },
                columns: [
                    { data: 'height', width: '8%' },
                    { data: 'time', width: '40%' },
                    { data: 'txlength', width: '5%' },
                    { data: 'size', width: '15%' },
                    { data: 'poolName', width: '25%' }
                ]
        });

        setInterval( function () {
            blockList.api().ajax.reload(null, false);
        }, 60000 );
    });
}

// Fetch block hash
function fetchBlockHash(blockHeight) {
    var returnValue = "";
    $.ajax({
        async: false,
        url: '' + explorerAPI + 'block-index/'+blockHeight,
        dataType: 'json',
        error: function() {
            returnValue = false;
        },
        success: function(data) {
            returnValue = data.blockHash;
        }
    });
    return returnValue;
}

// Fetch block details
function fetchBlock(blockHash) {
    $(document).ready(function() {
        $.ajax({
            url: '' + explorerAPI + 'block/'+blockHash,
            dataType: 'json',
            error: function() {
                //alert("We are having trouble connecting to the explorer right now...");
            },
            success: function(data) {
                $(".blockHash").text(data.hash);
                $(".blockSize").text(data.size);
                $(".blockHeight").text(data.height);
                $(".blockVersion").text(data.version);
                $(".blockMerkleroot").text(text_truncate(data.merkleroot,25));
                $(".blockTxcount").text(data.tx.length);
                $(".blockTime").text(new Date((data.time) * 1000).toUTCString());
                $(".blockNonce").text(text_truncate(data.nonce,25));
                $(".blockSolution").text(text_truncate(data.solution,25));
                $(".blockBits").text(data.bits);
                $(".blockDifficulty").text(data.difficulty);
                $(".blockChainwork").text(data.chainwork);
                $(".blockConfirmations").text(data.confirmationos);
                $(".blockPreviousblockhash").text(data.previousblockhash);
                $(".blockNextblockhash").text(data.nextblockhash);
                $(".blockReward").text(data.reward);
                $(".blockIsmainchain").text(data.isMainChain);
                $(".blockPoolname").text(data.poolInfo.poolName);
                $(".blockPoolurl").text(data.poolInfo.url);

                var nextBlock = (data.height+1);
                var lastBlock = (data.height-1);
                var nextBlockHash = data.nextblockhash;
                var lastBlockHash = data.previousblockhash;

                $('.blockLastblock').append('<a href="?block='+lastBlockHash+'">'+lastBlock+'</a>');

                if (nextBlockHash === undefined) {
                    $('.blockNextblock').append(nextBlock);
                } else {
                    $('.blockNextblock').append('<a href="?block='+nextBlockHash+'">'+nextBlock+'</a>');
                }

            }
        });
    });
}

// Fetch address/block TXs datatable
function fetchTxTable(input, type) {
    $(document).ready(function() {
        if(type == "block") {
            var blockTxTable = $('#blockTxTable').dataTable( {
                autoWidth: true,
                searching: true,
                ordering: false,
                responsive: true,
                lengthChange: true,
                processing: true,
                stateSave: true,
                ajax: {
                    url: '' + explorerAPI + 'txs/?block='+input,
                    dataSrc: function ( json ) {
                        for ( var x=0;x<json.txs.length; x++ ) {
                            json.txs[x]['txid'];
                            json.txs[x]['valueOut'];
                            json.txs[x]['recipients'] = json.txs[x]['vout'].length;
                        }
                        return json.txs;
                    }
                },
                    columns: [
                        { data: 'txid', width: '70%' },
                        { data: 'recipients', width: '15%' },
                        { data: 'valueOut', width: '15%' },
                        {   data: 'txid',
                            render : function(data, type, full, meta){
                                return '<a href="?tx='+data+'"><i class=\"fa fa-eye\"></i></a>'
                            }
                        }
                    ]
            });
            setInterval( function () {
                blockTxTable.api().ajax.reload(null, false);
            }, 60000 );
        } else if(type == "address") {
            var addressTxTable = $('#addressTxTable').dataTable( {
                autoWidth: true,
                searching: true,
                ordering: false,
                responsive: true,
                lengthChange: true,
                processing: true,
                stateSave: true,
                ajax: {
                    url: '' + explorerAPI + 'addrs/'+input+'/txs?from=0&to=50',
                    dataSrc: function ( json ) {
                        for ( var x=0;x<json.items.length; x++ ) {
                            json.items[x]['txid'];
                            json.items[x]['valueOut'];
                            json.items[x]['time'] = new Date((json.items[x]['time']) * 1000).toUTCString();
                        }
                        return json.items;
                    }
                },
                    columns: [
                        { data: 'time', width: '30%' },
                        { data: 'txid', width: '55%' },
                        { data: 'valueOut', width: '15%' },
                        {   data: 'txid',
                            render : function(data, type, full, meta){
                                return '<a href="?tx='+data+'"><i class=\"fa fa-eye\"></i></a>'
                            }
                        }
                    ]
            });
            setInterval( function () {
                addressTxTable.api().ajax.reload(null, false);
            }, 60000 );
        } else {
            console.log("Invalid type");
        }
    });
}

// Fetch Address Stats
function fetchAddressStats(addr) {
    $(document).ready(function() {
        $.ajax({
            url: '' + explorerAPI + 'addr/'+addr+'?noTxList=1',
            dataType: 'json',
            error: function() {
                //alert("We are having trouble connecting to the explorer right now...");
            },
            success: function(data) {
                $(".addrAddress").text(data.addrStr);
                $(".addrReceived").text(data.totalReceived);
                $(".addrSent").text(data.totalSent);
                $(".addrBalance").text(data.balance);
                $(".addrTxAppearances").text(data.txApperances);

                jQuery('#qrcode').qrcode({
                    width: "150",
                    height: "150",
                    text: data.addrStr
                });
            }
        });
    });
}

// Fetch Tx Stats
function fetchTXStats(txid) {
    $(document).ready(function() {
        $.ajax({
            url: '' + explorerAPI + 'tx/'+txid,
            dataType: 'json',
            error: function() {
                //alert("We are having trouble connecting to the explorer right now...");
            },
            success: function(data) {
                $(".txTxid").text(data.txid);
                $(".txBlockHash").text(data.blockhash);
                $(".txBlockHeight").text(data.blockheight);
                $(".txConfirmations").text(data.confirmations);
                data.time = new Date((data.time) * 1000).toUTCString();
                $(".txTime").text(data.time);
                data.blocktime = new Date((data.blocktime) * 1000).toUTCString();
                $(".txBlockTime").text(data.blocktime);
                $(".txValueOut").text(data.valueOut);
                $(".txSize").text(data.size);
                $(".txValueIn").text(data.valueIn);
                $(".txFees").text(data.fees);
                $(".txValueBalance").text(data.valueBalance);
                $(".txExpiryHeight").text(data.nExpiryHeight);

                var vin = data.vin;
                var vout = data.vout;
                //BlockTime
                if (blocktime) {
                    var blocktime = data.blocktime;
                    var blocktime = new Date(parseInt(blocktime*1000));
                    var blocktime = blocktime.toLocaleDateString() +' '+ blocktime.toLocaleTimeString();
                } else {
                    var blocktime = "Unconfirmed";
                }
                //TXID to transaction
                var txid = data.txid;
                //Value Out
                var vallueOut = data.valueOut
                //Confirmations
                var confirmations = data.confirmations;
                //Fees
                var fees = data.fees || 0;
                //Block Info
                var blockhash = data.blockhash || "Unconfirmed";
                var blockheight = data.blockheight

                var htmltoAddVin = "";
                if(vin.length > 0) {
                    var vinoutput = _(vin)
                    .groupBy('addr')
                    .map((v, k) => ({ addr: k, value: _.sumBy(v, 'value') }))
                    .value();

                    for (var j = 0; j < vinoutput.length; j++) {

                        if(vin[j].coinbase) {
                            // Coinbase
                            htmltoAddVin+= '<tr>';
                                htmltoAddVin+= '<td><div class=\"btn btn-warning waves-effect waves-light btn-sm btn-block\">Coinbase</div></td>';
                            htmltoAddVin+= '</tr>';
                        } else {
                            htmltoAddVin+= '<tr>';
                                htmltoAddVin+= '<td><a href=\"?address='+vinoutput[j].addr+'\"><div class=\"btn btn-secondary waves-effect waves-light btn-sm btn-block\">'+vinoutput[j].addr+ ' - ' + vinoutput[j].value +'</div></a></td>';
                            htmltoAddVin+= '</tr>';
                        }
                    }
                } else {
                    // Private address
                    htmltoAddVin+= '<tr>';
                        htmltoAddVin+= '<td><div class=\"btn btn-primary waves-effect waves-light btn-sm btn-block\">Private Address</div></td>';
                    htmltoAddVin+= '</tr>';
                }

                var htmltoAddVout = "";
                if(vout.length > 0) {
                    for (var f = 0; f < vout.length; f++) {
                        var voutaddr = vout[f].scriptPubKey.addresses;

                        for (var g = 0; g < voutaddr.length; g++) {
                            //Vout address
                            var voutaddr = voutaddr;
                            //Vout Value
                            var voutvalue = vout[f].value;

                            htmltoAddVout+= '<tr>';
                            htmltoAddVout+= '<td><a href=\"?address='+voutaddr+'\"><div class=\"btn btn-secondary waves-effect waves-light btn-sm btn-block\">'+voutaddr + ' - ' + voutvalue +'</div></a></td>';
                            htmltoAddVout+= '</tr>';
                        }
                    }
                } else {
                    htmltoAddVout+= '<tr>';
                        htmltoAddVout+= '<td><div class=\"btn btn-primary waves-effect waves-light btn-sm btn-block\">Private Address</div></td>';
                    htmltoAddVout+= '</tr>';
                }

                var htmlToAdd = "";
                htmlToAdd = '<div class=\"card m-b-0\">';
                        htmlToAdd+= '<div class=\"card-body\">';
                        htmlToAdd+= '<div class=\"text-center\">';
                            htmlToAdd+= '<div class=\"btn-group\" role=\"group\" aria-label=\"Basic example\">';
                                htmlToAdd+= '<span class="btn btn-secondary">Included in block:</span>'
                                htmlToAdd+= '<a href="?block='+blockhash+'"><span class="btn btn-light">'+blockhash+'</span></a>'
                            htmlToAdd+= '</div>'
                        htmlToAdd+= '</div>'
                        htmlToAdd+= '<i class="fa fa-arrow-right d-flex justify-content-center"></i>';
                            htmlToAdd+= '<div class="row">';
                                htmlToAdd+= '<div class="col-6">';
                                    htmlToAdd+= '<div class="table-responsive pull-left">';
                                        htmlToAdd+= '<table class="table">';
                                            htmlToAdd+= '<tbody>';
                                            htmlToAdd+= htmltoAddVin;
                                            htmlToAdd+= '</tbody>';
                                        htmlToAdd+= '</table>';
                                    htmlToAdd+= '</div>';
                                htmlToAdd+= '</div>';
                                htmlToAdd+= '<div class="col-6">';
                                    htmlToAdd+= '<div class="table-responsive pull-right">';
                                        htmlToAdd+= '<table class="table">';
                                            htmlToAdd+= '<tbody>';
                                            htmlToAdd+= htmltoAddVout;
                                            htmlToAdd+= '</tbody>';
                                        htmlToAdd+= '</table>';
                                    htmlToAdd+= '</div>';
                                htmlToAdd+= '</div>';
                            htmlToAdd+= '</div>';
                            htmlToAdd+= '<div class="col-12 m-bottom-70">';
                                htmlToAdd+= '<div class=\"pull-left btn btn-secondary waves-effect waves-light btn-sm\ m-b-10"><span class=\"btn-label\">Fee: </span>'+fees+'</div>';
                                htmlToAdd+= '<div class=\"btn-group pull-right\ m-b-10" role=\"group\" aria-label=\"Basic\">';
                                    htmlToAdd+= '<div class=\"btn btn-info waves-effect waves-light btn-sm\"><span class=\"btn-label\">Confirmations: </span>'+ confirmations + '</div>';
                                    htmlToAdd+= '<div class=\"btn btn-primary waves-effect waves-light btn-sm\"><span class=\"btn-label\">'+ vallueOut +'</span> '+tickerSymbol+'</div>';
                                htmlToAdd+= '</div>';
                            htmlToAdd+= '</div>';
                            htmlToAdd+= '</div>';
                        htmlToAdd+= '</div>';
                htmlToAdd+= '</div>';
                $("#txid").html($("#txid").html()+htmlToAdd);

            }
        });
    });
}

//Wallet Transactions
function walletTransactions(addr) {
    $(document).ready(function() {
        $.ajax({
            url: '' + explorerAPI + 'addrs/'+addr+'/txs?from=0&to=50',
            dataType: 'json',
            success: function(data) {
                t=0;
                for (var i = 0; i < data.items.length; i++) {
                    t++;
                    var vin = data.items[i].vin;
                    var vout = data.items[i].vout;
                    //BlockTime
                    var time = data.items[i].time;
                    var time = new Date(parseInt(time*1000));
                    var time = time.toLocaleDateString() +' '+ time.toLocaleTimeString();
                    //TXID to transaction
                    var txid = data.items[i].txid;
                    //Value Out
                    var vallueOut = data.items[i].valueOut
                    //Confirmations
                    var confirmations = data.items[i].confirmations;
                    //Fees
                    var fees = data.items[i].fees || 0;
                    //Block Info
                    var blockhash = data.items[i].blockhash || "Unconfirmed";
                    var blockheight = data.items[i].blockheight

                    var htmltoAddVin = "";
                    if(vin.length > 0) {
                        var vinoutput = _(vin)
                        .groupBy('addr')
                        .map((v, k) => ({ addr: k, value: _.sumBy(v, 'value') }))
                        .value();

                        for (var j = 0; j < vinoutput.length; j++) {

                            if(vin[j].coinbase) {
                                // Coinbase
                                htmltoAddVin+= '<tr>';
                                    htmltoAddVin+= '<td><div class=\"btn btn-warning waves-effect waves-light btn-sm btn-block\">Coinbase</div></td>';
                                htmltoAddVin+= '</tr>';
                            } else {
                                htmltoAddVin+= '<tr>';
                                    htmltoAddVin+= '<td><a href=\"?address='+vinoutput[j].addr+'\"><div class=\"btn btn-secondary waves-effect waves-light btn-sm btn-block\">'+vinoutput[j].addr+ ' - ' + parseFloat(vinoutput[j].value.toFixed(8)) +'</div></a></td>';
                                htmltoAddVin+= '</tr>';
                            }
                        }
                    } else {
                        // Private address
                        htmltoAddVin+= '<tr>';
                            htmltoAddVin+= '<td><div class=\"btn btn-primary waves-effect waves-light btn-sm btn-block\">Private Address</div></td>';
                        htmltoAddVin+= '</tr>';
                    }

                    var htmltoAddVout = "";
                    if(vout.length > 0) {
                        for (var f = 0; f < vout.length; f++) {
                            var voutaddr = vout[f].scriptPubKey.addresses;

                            for (var g = 0; g < voutaddr.length; g++) {
                                //Vout address
                                var voutaddr = voutaddr;
                                //Vout Value
                                var voutvalue = vout[f].value;

                                htmltoAddVout+= '<tr>';
                                htmltoAddVout+= '<td><a href=\"?address='+voutaddr+'\"><div class=\"btn btn-secondary waves-effect waves-light btn-sm btn-block\">'+voutaddr + ' - ' + voutvalue +'</div></a></td>';
                                htmltoAddVout+= '</tr>';
                            }
                        }
                    } else {
                        htmltoAddVout+= '<tr>';
                            htmltoAddVout+= '<td><div class=\"btn btn-primary waves-effect waves-light btn-sm btn-block\">Private Address</div></td>';
                        htmltoAddVout+= '</tr>';
                    }

                    var htmlToAdd = "";
                    htmlToAdd = '<div class=\"card m-b-0\">';
                        htmlToAdd+= '<div class=\"card-header\" role=\"tab\" id=\"heading'+ txid + t +'\">';
                            htmlToAdd+= '<h5 class=\"mb-0 mt-0 faq-title\">';
                            htmlToAdd+= '<a class=\"link\" data-toggle=\"collapse\" data-parent=\"#wallettransactions\" href=\"#collapse'+ txid + t +'\" aria-expanded=\"true\" aria-controls=\"'+ txid +'\">';
                                htmlToAdd+= '<div class=\"pull-left\">' + txid + '</div>';
                                htmlToAdd+= '<div class=\"pull-right\">' + time + '</div>';
                            htmlToAdd+= '</a>';
                            htmlToAdd+= '</h5>';
                        htmlToAdd+= '</div>';
                        htmlToAdd+= '<div id=\"collapse'+ txid + t +'\" class=\"collapse\" role=\"tabpanel\" aria-labelledby=\"heading'+ txid + t +'\">';
                            htmlToAdd+= '<div class=\"card-body\">';
                            htmlToAdd+= '<div class=\"text-center\">';
                                htmlToAdd+= '<div class=\"btn-group\" role=\"group\" aria-label=\"Basic example\">';
                                    htmlToAdd+= '<span class="btn btn-secondary">Included in block:</span>'
                                    htmlToAdd+= '<a href="?block='+blockhash+'"><span class="btn btn-light">'+blockhash+'</span></a>'
                                htmlToAdd+= '</div>'
                            htmlToAdd+= '</div>'
                            htmlToAdd+= '<i class="fa fa-arrow-right d-flex justify-content-center"></i>';
                                htmlToAdd+= '<div class="row">';
                                    htmlToAdd+= '<div class="col-6">';
                                        htmlToAdd+= '<div class="table-responsive pull-left">';
                                            htmlToAdd+= '<table class="table">';
                                                htmlToAdd+= '<tbody>';
                                                htmlToAdd+= htmltoAddVin;
                                                htmlToAdd+= '</tbody>';
                                            htmlToAdd+= '</table>';
                                        htmlToAdd+= '</div>';
                                    htmlToAdd+= '</div>';
                                    htmlToAdd+= '<div class="col-6">';
                                        htmlToAdd+= '<div class="table-responsive pull-right">';
                                            htmlToAdd+= '<table class="table">';
                                                htmlToAdd+= '<tbody>';
                                                htmlToAdd+= htmltoAddVout;
                                                htmlToAdd+= '</tbody>';
                                            htmlToAdd+= '</table>';
                                        htmlToAdd+= '</div>';
                                    htmlToAdd+= '</div>';
                                htmlToAdd+= '</div>';
                                htmlToAdd+= '<div class="col-12 m-bottom-70">';
                                    htmlToAdd+= '<div class=\"pull-left btn btn-secondary waves-effect waves-light btn-sm\ m-b-10"><span class=\"btn-label\">Fee:</span>'+fees+'</div>';
                                    htmlToAdd+= '<div class=\"btn-group pull-right\ m-b-10" role=\"group\" aria-label=\"Basic\">';
                                        htmlToAdd+= '<div class=\"btn btn-info waves-effect waves-light btn-sm\"><span class=\"btn-label\">Confirmations: </span>'+ confirmations + '</div>';
                                        htmlToAdd+= '<div class=\"btn btn-primary waves-effect waves-light btn-sm\"><span class=\"btn-label\">'+ vallueOut +'</span> '+tickerSymbol+'</div>';
                                    htmlToAdd+= '</div>';
                                htmlToAdd+= '</div>';
                                htmlToAdd+= '</div>';
                            htmlToAdd+= '</div>';
                        htmlToAdd+= '</div>';
                    htmlToAdd+= '</div>';
                    $("#wallettransactions").html($("#wallettransactions").html()+htmlToAdd);
                }
            }
        });
    });
}

// Charts
function buildChart() {
    $(document).ready(function() {

        // Price History
        function priceHistory() {
            $(this).siblings().removeClass('active')
            $(this).addClass('active');
            var coinPricePoints = []
            $.ajax({
                type: 'GET',
                url: 'https://api.coingecko.com/api/v3/coins/'+_cgID+'/market_chart?vs_currency=btc&days=90',
                dataType: 'json',
                success: function(data) {
                    var data = data.prices;
                    for (var i = 0; i < data.length; i++) {
                        coinPricePoints.push({
                            x: data[i][0],
                            y: data[i][1]
                        });
                    }

                    var chart = new CanvasJS.Chart("charts", {
                        animationEnabled: true,
                        backgroundColor: "transparent",
                        title: {
                            text: "Price History"
                        },
                        axisY:{
                            title:"BTC"
                        },
                        data: [{
                            type: "spline",
                            color: "#47358f",
                            xValueType: "dateTime",
                            dataPoints: coinPricePoints
                        }]
                    });

                    chart.render();
                }
            });
        }
        priceHistory();

        $("#coinValue").click(function() {
            priceHistory();
            $(this).siblings().removeClass('active')
            $(this).addClass('active');
        });

        // Block Size
        $("#blockSize").click(function() {
            $(this).siblings().removeClass('active')
            $(this).addClass('active');
            var blockSizePoints = []
            $.ajax({
                type: 'GET',
                url: '' + explorerAPI + 'blocks',
                dataType: 'json',
                success: function(data) {
                    for (var i = 0; i < data.length; i++) {
                        blockSizePoints.push({
                            x: data.blocks[i].height,
                            y: data.blocks[i].size
                        });
                    }

                    var chart = new CanvasJS.Chart("charts", {
                        animationEnabled: true,
                        backgroundColor: "transparent",
                        title: {
                            text: "Block Size"
                        },
                        axisY:{
                            title:"Size (bytes)"
                        },
                        data: [{
                            type: "column",
                            color: "#47358f",
                            dataPoints: blockSizePoints
                        }]
                    });

                    chart.render();
                }
            });
        });

        // Block Interval
        $("#blockInterval").click(function() {
            $(this).siblings().removeClass('active')
            $(this).addClass('active');
            var blockIntervalPoints = []
            $.ajax({
                type: 'GET',
                url: '' + explorerAPI + 'blocks',
                dataType: 'json',
                success: function(data) {
                    var last;
                    var sum = 0;
                    for (var i = 0; i < data.length; i++) {
                        var last = lastTime
                        var interval = (last - data.blocks[i].time);
                        blockIntervalPoints.push({
                            x: data.blocks[i].height,
                            y: interval
                        });

                        var lastTime = data.blocks[i].time;
                        
                        var avgInterval = ((data.blocks[0].time - data.blocks[i].time)/data.length);
                    }

                    var chart = new CanvasJS.Chart("charts", {
                        animationEnabled: true,
                        backgroundColor: "transparent",
                        title: {
                            text: "Block Interval"
                        },
                        axisY:{
                            title:"Interval (Seconds)",
                            stripLines: [{
                                value: avgInterval,
                                color: "black",
                                label: 'Average ('+avgInterval+')'
                            }]
                        },
                        data: [{
                            type: "column",
                            color: "#47358f",
                            dataPoints: blockIntervalPoints
                        }]
                    });

                    chart.render();
                }
            });
        });
    });
}
