import * as React from 'react';
import { Modal, ActivityIndicator, } from 'react-native';

function loadDialog(shouldShow){
    return( 
        <Modal visible={shouldShow} presentationStyle="overFullScreen" transparent={true}>
            <ActivityIndicator size="small"  />
        </Modal>
    );
}