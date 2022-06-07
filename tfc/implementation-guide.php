<?php 
   include('head.php');
   include('header.php');

?>


<section class="contact-us-heading m-t-80 m-b-50">
    <div class="container">
        <h1 class="white">Implementation Guide</h1>
        <span class="line"></span>
        <div class="clearfix"></div>
        <p>
            Step by step guide to setup your CRM according to you.
        </p>
    </div>
</section>

<section id="help-detail">
    <div class="container">
        <div class="row">
            <div class="col-md-3 asidemenu">
                <ul class="nav flex-column flex-nowrap">
                    <!-- <li class="nav-item"><a class="nav-link" href="#">Accounts</a></li> -->
                    <li class="nav-item">
                        <a class="nav-link collapsed " onclick="myFunction(this)" id="account" href="#submenu1" data-toggle="collapse" data-target="#submenu1"><i class="fas fa-plus myplus"></i> Accounts</a>
                        <div class="collapse" id="submenu1" aria-expanded="false">
                            <ul class="flex-column pl-4 nav">
                                <li class="nav-item"><a class="nav-link py-0" href="#">Account 1</a></li>
                                <li class="nav-item"><a class="nav-link py-0" href="#">Account 2</a></li>
                                <li class="nav-item"><a class="nav-link py-0" href="#">Account 3</a></li>
                            </ul>
                        </div>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link collapsed" onclick="myFunction(this)" id="contact" href="#submenu2" data-toggle="collapse" data-target="#submenu2">
                            <i class="fas fa-plus myplus"></i> Contacts</a>
                        <div class="collapse" id="submenu2" aria-expanded="false">
                            <ul class="flex-column pl-4 nav">
                                <li class="nav-item"><a class="nav-link py-0" href="#">Contacts 1</a></li>
                                <li class="nav-item"><a class="nav-link py-0" href="#">Contacts 2</a></li>
                                <li class="nav-item"><a class="nav-link py-0" href="#">Contacts 3</a></li>
                            </ul>
                        </div>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link collapsed" onclick="myFunction(this)" id="lead1" href="#submenu3" data-toggle="collapse" data-target="#submenu3">
                            <i class="fas fa-plus myplus"></i> Leads</a>
                        <div class="collapse" id="submenu3" aria-expanded="false">
                            <ul class="flex-column pl-4 nav">
                                <li class="nav-item"><a class="nav-link py-0" href="#">Leads 1</a></li>
                                <li class="nav-item"><a class="nav-link py-0" href="#">Leads 2</a></li>
                                <li class="nav-item"><a class="nav-link py-0" href="#">Leads 3</a></li>
                            </ul>
                        </div>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link collapsed" onclick="myFunction(this)" id="task1" href="#submenu4" data-toggle="collapse" data-target="#submenu4">
                            <i class="fas fa-plus myplus"></i> Tasks</a>
                        <div class="collapse" id="submenu4" aria-expanded="false">
                            <ul class="flex-column pl-4 nav">
                                <li class="nav-item"><a class="nav-link py-0" href="#">Tasks 1</a></li>
                                <li class="nav-item"><a class="nav-link py-0" href="#">Tasks 2</a></li>
                                <li class="nav-item"><a class="nav-link py-0" href="#">Tasks 3</a></li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="col-md-9 help-detail-content">
                <h1>Implementation Guide</h1>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                <figure>
                    <a href="images/account1.jpg" data-fancybox data-caption="Caption for single image">
                        <img src="images/account1.jpg" alt="" class="img-fluid" />
                    </a>
                </figure>
                <ul>
                    <li><a href="">home</a></li>
                </ul>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                <figure>
                    <a href="images/account1.jpg" data-fancybox data-caption="Caption for single image">
                        <img src="images/account1.jpg" alt="" class="img-fluid" />
                    </a>
                </figure>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                <figure>
                    <a href="images/account1.jpg" data-fancybox data-caption="Caption for single image">
                        <img src="images/account1.jpg" alt="" class="img-fluid" />
                    </a>
                </figure>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
            </div>
        </div>
    </div>
</section>


<?php 
   include('footer.php');

?>