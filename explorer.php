<?php

// Functions //
$insightLink = "https://insight.zeroclassic.org/api/";
$tickerSymbol = "ZERC";
$coinGeckoID = "zeroclassic";
$zercDonationAddress = "t1NY9yCxG1gT7x5xtoraVGKRUt23JJThXKR";

// Filter
function filter($data) {
	$data = trim($data);
	$data = addslashes($data);
	$data = strip_tags($data);
	$data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
	return $data;
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>ZeroClassic Explorer</title>
	<meta name="description" content="ZeroClassic Explorer" />
	<meta name="keywords" content="zeroclassic, zerc, zero, zcash" />
	<meta name="author" content="tempload"/>

	<!-- Favicon -->
	<link rel="icon" type="image/png" href="assets/images/logos/zerc-logo-trans-purp.png" />

	<!-- Bootstrap & Plugins CSS -->
	<link href="/assets/css/bootstrap.min.css" rel="stylesheet" type="text/css">
	<link href="/assets/css/font-awesome.min.css" rel="stylesheet" type="text/css">

	<!-- Custom CSS -->
	<link href="/assets/css/dark.css" rel="stylesheet" type="text/css">
	<link rel="stylesheet" type="text/css" href="//cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css">

	<!-- jQuery -->
	<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
	<script src='//cdn.jsdelivr.net/lodash/4.17.2/lodash.min.js'></script>

	<!-- Data Table -->
	<script src="//cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"></script>

	<!-- SweetAlert -->
	<script src="//cdnjs.cloudflare.com/ajax/libs/sweetalert/2.1.2/sweetalert.min.js"></script>

	<!-- CanvasJS -->
	<script src="//cdnjs.cloudflare.com/ajax/libs/canvasjs/1.7.0/canvasjs.min.js"></script>

	<!-- Explorer -->
	<script src="/explorer.js"></script>
	<script>
		<?php echo "var explorerAPI = \"".$insightLink."\";"; ?>
		<?php echo "var tickerSymbol = \"".$tickerSymbol."\";"; ?>
		<?php echo "var _cgID = \"".$coinGeckoID."\";"; ?>
	</script>

	<script src="//cdnjs.cloudflare.com/ajax/libs/jquery.qrcode/1.0/jquery.qrcode.min.js"></script>

</head>
<body>

	<div class="loading-wrapper">
		<div class="loading">
			<div></div>
			<div></div>
			<div></div>
		</div>
	</div>

	<!-- ***** Header Area Start ***** -->
	<header class="header-area">
		<div class="container">
			<div class="row">
				<div class="col-12">
					<nav class="main-nav">
						<!-- ***** Logo Start ***** -->
						<a href="explorer.php" class="logo">
                            <img src="/assets/images/logos/zerc-logo-text-white.png" class="light-logo" alt="Zero Classic"/>
							<img src="/assets/images/logos/zerc-logo-text-black.png" class="dark-logo" alt="Zero Classic"/>
						</a>
						<!-- ***** Logo End ***** -->

						<!-- ***** Menu Start ***** -->
						<ul class="nav">
							<li><a href="explorer.php?blocks">Blocks</a></li>
                            <li><a href="explorer.php?charts">Charts</a></li>
							<li><a href="https://zeroclassic.org/#wallet" class="btn-nav-box">WALLETS</a></li>
						</ul>
						<!-- ***** Menu End ***** -->
					</nav>
				</div>
			</div>
		</div>
	</header>
	<!-- ***** Header Area End ***** -->

	<!-- ***** Wellcome Area Start ***** -->
	<section class="block-explorer-wrapper bg-bottom-center" id="welcome-1">
		<div class="block-explorer text">
			<div class="container text-center">
				<div class="row">
					<div class="col-lg-12 align-self-center">
						<h1>ZeroClassic Explorer</h1>
					</div>
					<div class="offset-lg-3 col-lg-6">
						<p>Current Height: <span class="currHeight">...</span></p>
					</div>
				</div>
			</div>
		</div>
		<div class="search">
			<div class="container">
				<div class="row">
					<div class="col-lg-12">
						<form id="search">
							<div class="input-wrapper">
								<div class="input">
									<input type="text" placeholder="address, block, hash, transaction, etc..." name="query" id="query" required>
									<button type="submit" value="search"><i class="fa fa-search"></i></button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</section>
	<!-- ***** Wellcome Area End ***** -->

<?php

// Homepage stats
if( empty($_GET) ) { ?>

	<script>
		homeStats(<?php echo "\"".$coinGeckoID."\""; ?>, true);
	</script>

    <section class="block-explorer-features section bg-bottom">
		<div class="container">
			<div class="row">
				<div class="col-lg-12">
					<div class="center-heading">
						<h2 class="section-title">ZeroClassic Decentralized Currency</h2>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
					<div class="item">
						<div class="title">
							<div class="icon"></div>
							<h5>ZERC Price</h5>
						</div>
						<div class="text">
							<span class="btcprice">...</span> ($<span class="usdprice">...</span>) <i class="fa price-change24" aria-hidden="true"></i>
						</div>
					</div>
				</div>
				<div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
					<div class="item">
						<div class="title">
							<div class="icon"></div>
							<h5>Market Cap</h5>
						</div>
						<div class="text">
							$<span class="marketCap">...</span>
						</div>
					</div>
				</div>
				<div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
					<div class="item">
						<div class="title">
							<div class="icon"></div>
							<h5>Total Supply</h5>
						</div>
						<div class="text">
							<span class="homeTotalSupply">...</span> <?php echo $tickerSymbol; ?>
						</div>
					</div>
				</div>
				<div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
					<div class="item">
						<div class="title">
							<div class="icon"></div>
							<h5>Hashrate</h5>
						</div>
						<div class="text">
							<span class="homeNetworkSols">...</span> Sol/s
						</div>
					</div>
				</div>
				<div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
					<div class="item">
						<div class="title">
							<div class="icon"></div>
							<h5>Difficulty</h5>
						</div>
						<div class="text">
							<span class="homeDifficulty">...</span>
						</div>
					</div>
				</div>
				<div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
					<div class="item">
						<div class="title">
							<div class="icon"></div>
							<h5>Version</h5>
						</div>
						<div class="text">
						<span class="homeVersion">...</span>
						</div>
					</div>
				</div>
				<div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
					<div class="item">
						<div class="title">
							<div class="icon"></div>
							<h5>Protocol Version</h5>
						</div>
						<div class="text">
						<span class="homeProtocolVersion">...</span>
						</div>
					</div>
				</div>
				<div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
					<div class="item">
						<div class="title">
							<div class="icon"></div>
							<h5>Connections</h5>
						</div>
						<div class="text">
						<span class="homeConnections">...</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

<?php
// Latest Blocks
} else if( isset($_GET["blocks"]) && empty($_GET["blocks"]) ) {
?>

	<script>
		fetchLatestBlocks();
	</script>

    <section class="block-explorer-section section bg-bottom">
		<div class="container">
			<div class="row">
				<div class="col-lg-12">
					<div class="center-heading">
						<h2 class="section-title">Latest Blocks</h2>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-lg-12">
					<div class="table-responsive">
						<table id="blockList" class="table table-striped table-latests">
							<thead class="text-left">
								<tr>
									<th>Height</th>
									<th>Timestamp</th>
									<th>Transactions</th>
									<th>Size</th>
									<th>Mined by</th>
								</tr>
							</thead>
							<tbody>

							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</section>

<?php
// Block Hash
} else if( isset($_GET["block"]) && !empty($_GET["block"]) ) {
?>

	<script>
		fetchBlock(<?php echo "\"".filter($_GET["block"])."\""; ?>);
		fetchTxTable(<?php echo "\"".filter($_GET["block"])."\""; ?>, "block");
	</script>

	<section class="block-explorer-section section bg-bottom">
		<div class="container">
			<div class="row">
				<div class="col-lg-12">
					<div class="center-heading">
						<h2 class="section-title">Block #<span class="blockHeight">...</span></h2>
					</div>
						<div class="center-text">
							<p><span class="blockHash">...</span></p>
						</div>
				</div>
			</div>
			<div class="row">
				<div class="col-lg-6 col-md-6 col-sm-12 m-bottom-70">
					<div class="table-responsive">
						<table class="table table-striped table-latests table-detail">
							<tbody>
								<tr>
									<td><strong>No. Transactions</strong></td>
									<td><span class="blockTxcount">...</span></td>
								</tr>
								<tr>
									<td><strong>Height</strong></td>
									<td><span class="blockHeight">...</span></td>
								</tr>
								<tr>
									<td><strong>Block Reward</strong></td>
									<td><span class="blockReward">...</span></td>
								</tr>
								<tr>
									<td><strong>Timestamp</strong></td>
									<td><span class="blockTime">...</span></td>
								</tr>
								<tr>
									<td><strong>Mined by</strong></td>
									<td><a href="#" class="blockPoolname"></a></td>
								</tr>
								<tr>
									<td><strong>Merkle Root</strong></td>
									<td><span class="blockMerkleroot">...</span></td>
								</tr>
								<tr>
									<td><strong>Previous Block</strong></td>
									<td class="blockLastblock"></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<div class="col-lg-6 col-md-6 col-sm-12 m-bottom-70">
					<div class="table-responsive">
						<table class="table table-striped table-latests table-detail">
							<tbody>
								<tr>
									<td><strong>Difficulty</strong></td>
									<td><span class="blockDifficulty">...</span></td>
								</tr>
								<tr>
									<td><strong>Bits</strong></td>
									<td><span class="blockBits">...</span></td>
								</tr>
								<tr>
									<td><strong>Size (Bytes)</strong></td>
									<td><span class="blockSize">...</span></td>
								</tr>
								<tr>
									<td><strong>Version</strong></td>
									<td><span class="blockVersion">...</span></td>
								</tr>
								<tr>
									<td><strong>Nonce</strong></td>
									<td><span class="blockNonce">...</span></td>
								</tr>
								<tr>
									<td><strong>Solution</strong></td>
									<td><span class="blockSolution">...</span></td>
								</tr>
								<tr>
									<td><strong>Next Block</strong></td>
									<td class="blockNextblock"></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-lg-12">
					<div class="center-heading">
						<h2 class="section-title">Transactions</h2>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-lg-12">
					<div class="table-responsive">
						<table id="blockTxTable" class="table table-striped table-latests table-bordered">
							<thead class="text-left">
								<tr>
									<th>Hash</th>
									<th>Recipients</th>
									<th>Amount (<?php echo $tickerSymbol; ?>)</th>
									<th></th>
								</tr>
							</thead>
							<tbody>

							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
    </section>

<?php
// Address History
} else if( isset($_GET["address"]) && !empty($_GET["address"]) ) {
?>

	<script>
		fetchAddressStats(<?php echo "\"".filter($_GET['address'])."\""; ?>);
		fetchTxTable(<?php echo "\"".filter($_GET["address"])."\""; ?>, "address");
		walletTransactions(<?php echo "\"".filter($_GET['address'])."\""; ?>);

	</script>

    <section class="block-explorer-section section bg-bottom">
		<div class="container">
			<div class="row">
				<div class="col-lg-12">
					<div class="center-heading">
						<h2 class="section-title"><span class="addrBalance">...</span> <?php echo $tickerSymbol; ?></h2>
					</div>
				</div>
			</div>
			<div class="row m-bottom-70">
				<div class="col-lg-9 col-md-9 col-sm-12">
					<div class="table-responsive">
						<table class="table table-striped table-latests table-detail">
							<tbody>
								<tr>
									<td><strong>Address</strong></td>
									<td><span class="addrAddress">...</span></td>
								</tr>
								<tr>
									<td><strong>Total Received</strong></td>
									<td><span class="addrReceived">...</span></td>
								</tr>
								<tr>
									<td><strong>Total Sent</strong></td>
									<td><span class="addrSent">...</span></td>
								</tr>
								<tr>
									<td><strong>Final Balance</strong></td>
									<td><span class="addrBalance">...</span></td>
								</tr>
								<tr>
									<td><strong>No. Transactions</strong></td>
									<td><span class="addrTxAppearances">...</span></td>
								</tr>
								<?php if(filter($_GET['address'] == $zercDonationAddress)) { ?>
								<tr>
									<td class="table-success text-center" colspan="2"><strong>Community Donation Address</strong></td>
								</tr>
								<?php } ?>
							</tbody>
						</table>
					</div>
				</div>
				<div class="col-lg-3 col-md-3 col-sm-12">
					<div class="qr">
						<div style="width: 150px; margin: auto;" id="qrcode"></div>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-lg-12">
					<div class="center-heading">
						<h2 class="section-title">Transactions</h2>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-lg-12">
					<div class="faq" id="wallettransactions" role="tablist" aria-multiselectable="true">
					</div>
				</div>
			</div>
		</div>
    </section>

<?php
// TxID
} else if( isset($_GET["tx"]) && !empty($_GET["tx"]) ) {
?>

	<script>
		fetchTXStats(<?php echo "\"".filter($_GET['tx'])."\""; ?>);

	</script>

	<section class="block-explorer-section section bg-bottom">
		<div class="container">
			<div class="row">
				<div class="col-lg-12">
					<div class="center-heading">
						<h3 class="section-title">Transaction Summary</h3>
					</div>
				</div>
			</div>
			<div class="row m-bottom-70">
				<div class="col-lg-12 col-md-12 col-sm-12">
					<div class="table-responsive">
						<table class="table table-striped table-latests table-detail">
							<tbody>
								<tr>
									<td><strong>TX</strong></td>
									<td class="text-right"><span class="txTxid">...</span></td>
								</tr>
								<tr>
									<td><strong>Size</strong></td>
									<td class="text-right"><span class="txSize">...</span> (bytes)</td>
								</tr>
								<tr>
									<td><strong>Received Time</strong></td>
									<td class="text-right"><span class="txTime">...</span></td>
								</tr>
								<tr>
									<td><strong>Mined Time</strong></td>
									<td class="text-right"><span class="txBlockTime">...</span></td>
								</tr>
								<tr>
									<td><strong>Included in Block</strong></td>
									<td class="text-right"><span class="txBlockHeight">...</span></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-lg-12">
					<div class="center-heading">
						<h2 class="section-title">Details</h2>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-lg-12">
					<div id="txid" role="tablist" aria-multiselectable="true">
					</div>
				</div>
			</div>
		</div>
	</section>

<?php
} else if( isset($_GET["charts"]) && empty($_GET["blocks"]) ) { ?>

	<script>
		buildChart();
	</script>

	<section class="block-explorer-section section bg-bottom">
		<div class="container">
			<div class="row">
				<div class="col-lg-12 col-md-12 col-sm-12">
					<div id="charts" style="height: 370px; width: 100%;"></div>
				</div>
			</div>
			<div class="row">
				<div class="col-lg-12">
					<div class="center-heading">
						<div class="btn-group d-flex" role="group" aria-label="Basic example">
							<button type="button" id="coinValue" class="btn btn-dark w-100 active">Price History</button>
							<button type="button" id="networkHashrate" class="btn btn-dark w-100 disabled">Network Hashrate</button>
							<button type="button" id="blockDifficulty" class="btn btn-dark w-100 disabled">Block Difficulty</button>
							<button type="button" id="blockSize" class="btn btn-dark w-100">Block Size</button>
							<button type="button" id="blockInterval" class="btn btn-dark w-100">Block Interval</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

<?php
} else {
	// You may all go to hell, and I will go to Texas!
	echo "<script>window.location.replace(\"?\");</script>";
}

?>

	<!-- ***** Contact & Footer Start ***** -->
	<footer id="contact">
		<div class="footer-bottom slim">
			<div class="container">
				<div class="row">
					<div class="col-lg-12">
						<p class="copyright"><?php echo date("Y"); ?> © ZeroClassic - Powered by <a href="https://github.com/zeroclassic/insight-api-zeroclassic">Insight-API</a></p>
					</div>
				</div>
			</div>
		</div>
	</footer>
	<!-- ***** Contact & Footer End ***** -->

	<!-- Bootstrap -->
	<script src="assets/js/popper.js"></script>
	<script src="assets/js/bootstrap.min.js"></script>

	<!-- Plugins -->
	<script src="assets/js/particles.min.js"></script>
	<script src="assets/js/scrollreveal.min.js"></script>
	<script src="assets/js/jquery.downCount.js"></script>
	<script src="assets/js/parallax.min.js"></script>

	<!-- Global Init -->
	<script src="assets/js/particle-purple.js"></script>
	<script src="assets/js/custom.js"></script>

</body>
</html>
