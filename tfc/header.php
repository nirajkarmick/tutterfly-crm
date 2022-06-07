<body id="home">
	<header>
		<nav class="navbar navbar-expand-lg navbar-light bg-light">
  			<div class="container">
  				<a class="navbar-brand" href="index.php"><img src="images/logo.png" width="180"></a>
  				<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    				<i class="fas fa-bars"></i>
  				</button>

	  			<div class="collapse navbar-collapse" id="navbarSupportedContent">
	    			<ul class="navbar-nav ml-auto">
	      				<li class="nav-item">
	      					<a class="nav-link" href="index.php">Home</a>
	      				</li>
	      				<li class="nav-item dropdown">
        					<a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					          Resources
					        </a>
        					<div class="dropdown-menu" aria-labelledby="navbarDropdown">
          						<a class="dropdown-item" href="implementation-guide.php">Implementation Guide</a>
          						<a class="dropdown-item" href="best-practices.php">Best Practices</a>
          						<a class="dropdown-item" href="help.php">Help Center</a>
          						<a class="dropdown-item" href="#">Instructional Videos</a>
        					</div>
      					</li>
						<li class="nav-item">
							<a class="nav-link" href="pricing.php">Pricing</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" href="contact.php">Contact Us</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" href="javascript:void(0);"  data-toggle="modal" data-target=".bd-example-modal-xl">Request For Demo</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" href="https://www.tutterflycrm.com/app/login">Login</a>
						</li>
	    			</ul>
      				<a href="https://www.tutterflycrm.com/app/register" class="btn btn-primary myheaderbutton my-2 my-sm-0" >Get Started</a>
	  			</div>
  			</div>
		</nav>

		<div class="modal fade bd-example-modal-xl" id="popuprequestfordemo" tabindex="-1" role="dialog" data-backdrop="static" and data-keyboard="false" aria-labelledby="myExtraLargeModalLabel" aria-hidden="true">
			<div class="modal-dialog modal-xl">
				<div class="modal-content">
					<!--<div class="modal-header">
                        <h5 class="modal-title h4" id="myExtraLargeModalLabel">Extra large modal</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>-->
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">×</span>
					</button>
					<div class="modal-body padding-0">
						<div class="demoform-div">
							<div class="row">
								<div class="demo-holder">
									<div class="demo-content">
										<form action="" class="demo-form">
											<div class="row">
												<div class="col-6">
													<div class="form-group">
														<label class="form-label" for="firstname">First Name</label>
														<input type="text" name="firstname-head" class="form-control" id="firstname-head" required>
													</div>
												</div>
												<div class="col-6">
													<div class="form-group">
														<label class="form-label" for="lastname">Last Name</label>
														<input type="text" name="lastname-head" class="form-control" id="lastname-head" required>
													</div>
												</div>
											</div>
											<div class="form-group">
												<!--<label class="form-label" for="jobtitle">Job Title</label>-->
												<select name="jobtitle" id="jobtitle-head" class="form-control" required>
													<option>Job Title</option>
													<option>Sales Manager</option>
													<option>Marketing / PR Manager</option>
													<option>Customer Service Manager</option>
													<option>General Manager</option>
													<option>IT Manager</option>
													<option>Operations Manager</option>
													<option>Others</option>
												</select>
											</div>
											<div class="form-group">
												<label class="form-label" for="phone-head">Phone</label>
												<input type="tel" name="phone" class="form-control" id="phone-head" required>
											</div>
											<div class="form-group">
												<label class="form-label" for="organization-head">Organization</label>
												<input type="text" name="organization" class="form-control" id="organization-head" required>
											</div>
											<div class="form-group">
												<label class="form-label" for="employees-head">No of Employees</label>
												<input type="text" name="employees-head" class="form-control" id="employees-head" required>
											</div>
											<div class="form-group">
												<!--<label class="form-label" for="country">Select Country</label>-->
												<select name="country" id="country-head" class="form-control" required>
													<option>Select Country</option>
													<option>Afghanistan</option>
													<option>Albania</option>
													<option>American Samoa</option>
													<option>Andorra</option>
													<option>Angola</option>
													<option>Anguilla</option>
													<option>Antarctica</option>
												</select>
											</div>
											<div class="form-group">
												<label class="form-label" for="email-head">Email</label>
												<input type="email" name="email" class="form-control" id="email-head" required>
											</div>
											<button class="btn btn-primary btn-round float-right">Request</button>
										</form>
									</div>
								</div>
								<div class="demo-img-holder">
									<div class="bg"></div>
									<div class="demo-info-holder">
										<img src="images/login-right-bg.png" alt="">
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</header>
	
	