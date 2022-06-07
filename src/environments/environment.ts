// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  //  ip:"https://tnt1.tutterflycrm.com/tfc/api", 
    //ip:"https://prashanthadda.xyz/tfc/api", 
  // ip:"http://192.168.1.227:8000/api",
   //ip:"http://15.207.231.183/tfc/api",
     //ip:"https://dorjee.tutterflycrm.com/tfc/api",
   ip:"https://adrenotravel.tutterflycrm.com/tfc/api",
 // ip:window.location.protocol+'//'+window.location.host+"/tfc/api", 
  cookieDomain:window.location.protocol+'//'+window.location.host,
  coordinateKey:'AIzaSyBpny7f4norxynsPJphb9x5miXPCMETyN8',
  // coordinateKey:'AIzaSyDf0kn2QZHVJaf_coAIHJIK3v6RrDUDAj8',
  current_url:window.location.protocol+'//'+window.location.hostname,   
  // pullit:"http://52.25.193.143/ptprog/"  
  pullit:"https://api.tutterflycrm.com/ptprog/"  ,
  gmail:"https://tnt1.tutterflycrm.com/mail_test/gmail/public/"           
}; 
