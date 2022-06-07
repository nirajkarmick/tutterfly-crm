<?php 
   include('head.php');
   include('header.php');

?>

<section class="contact-us-heading m-t-80 m-b-50">
    <div class="container">
        <h1 class="white">Get in touch</h1>
        <span class="line"></span>
        <div class="clearfix"></div>
        <p>
            Write us a few words about your company or share your feedback.
        </p>
    </div>
</section>

<section class="contact-us-form">
    <div class="container">
        <div class="contact-box">
            <div class="contact-box-container">
                <div class="row p-t-50 p-b-40">
                    <div class="map-watermark"><img src="images/world-map-watermark.png" alt="" class="img-fluid"></div>
                    <div class="col-md-6 text-center">
                        <h3 class="m-b-30 m-t-20">Drop us a line</h3>
                        <img src="images/contact-img.png" alt="" class="img-fluid contact-page-left-img">
                    </div>
                    <div class="col-md-6">
                        <form action="" class="">
                            <div class="form-group">
                                <label class="form-label" for="name">Full Name</label>
                                <input type="text" name="" class="form-control" id="name" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="email">Email ID</label>
                                <input type="email" name="" class="form-control" id="email" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="phone">Phone</label>
                                <input type="tel" name="" class="form-control" id="phone" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="company">Company Name</label>
                                <input type="text" name="" class="form-control" id="company" required>
                            </div>
                            <div class="form-group floating-label">
                                <textarea name="" id="textareamessage" cols="30" rows="4" class="form-control floating-input floating-textarea" placeholder=" " required></textarea>
                                <!--<span class="highlight"></span>-->
                                <label class="form-label" for="textareamessage" >Your comments...</label>
                            </div>
                            <button type="submit" class="btn btn-primary btn-round float-right">Submit</button>
                        </form>
                    </div>
                </div>
                <div class="row social-media-icons">
                    <div class="col-lg-4">
                        <p class="margin-0"><i class="fas fa-phone-alt"></i> 1800 000 1111</p>
                    </div>
                    <div class="col-lg-4">
                        <p class="margin-0"><i class="fas fa-envelope-open"></i> <span>info@tutterflycrm.com, sales@tutterflycrm.com</span></p>
                    </div>
                    <div class="col-lg-4">
                        <ul class="social-network social-circle">
                            <li><a href="javascript:void(0);" class="icoFacebook" title="Facebook"><i class="fab fa-facebook-f"></i></a></li>
                            <li><a href="javascript:void(0);" class="icoTwitter" title="Twitter"><i class="fab fa-twitter"></i></a></li>
                            <li><a href="javascript:void(0);" class="icoLinkedin" title="Linkedin"><i class="fab fa-linkedin-in"></i></a></li>
                            <li><a href="javascript:void(0);" class="icoGoogle" title="Google +"><i class="fab fa-instagram"></i></a></li>
                            <li><a href="javascript:void(0);" class="icoRss" title="Rss"><i class="fab fa-pinterest-p"></i></a></li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    </div>
</section>


<?php 
   include('footer.php');
?>