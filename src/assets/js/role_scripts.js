function open_userlist(role_id,role_name){
        console.log(role_id);
        $("#hidden_users").val(role_id);
        $("#hidden_role_name").val(role_name);
        $('#trigger_userList').trigger('click');
}
 
  function open_add_user(role_id,role_name){
        console.log(role_id);
        $("#hidden_users").val(role_id);
        $("#hidden_role_name").val(role_name);
        $('#trigger_add_user').trigger('click');
}

  function open_edit_role(role_id,role_name){
        console.log(role_id);
        $("#hidden_users").val(role_id);
        $("#hidden_role_name").val(role_name);
        $('#trigger_edit_user').trigger('click');
}

  function open_delete_role(role_id,role_name){
        console.log(role_id);
        $("#hidden_users").val(role_id);
        $("#hidden_role_name").val(role_name);
        $('#trigger_delete_role').trigger('click');
}

function open_add_role(role_id,role_name){
        console.log(role_id);
        $("#hidden_users").val(role_id);
        $("#hidden_role_name").val(role_name);
        $('#trigger_add_role').trigger('click');
}