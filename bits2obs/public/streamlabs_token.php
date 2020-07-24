<?php
    require_once 'streamlabs_config.php';
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    $result = array('error' => '');
    $code = isset($_REQUEST['code'])?trim($_REQUEST['code']):'';
    if ( $code == '' )
    {
        $result['error'] = 'No code specified';
        die(json_encode($result));
    }

    $uri = 'https://streamlabs.com/api/v1.0/token';
    $params = array('grant_type' => 'authorization_code', 
                    'client_id' => STREAMLABS_CLIENT_ID, 
                    'client_secret' => STREAMLABS_CLIENT_SECRET, 
                    'redirect_uri' => STREAMLABS_REDIRECT_URI,
                    'code' => $code);
    $options = array(
        'http' => array(
            'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
            'method'  => 'POST',
            'content' => http_build_query($params)
        )
    );

    $context = stream_context_create($options);
    $response = file_get_contents($uri, false, $context);
    if ($response === false)
    {
        $result['error'] = 'Failed to retrieve an access token';
        die(json_encode($result));
    }
    echo $response;
?>