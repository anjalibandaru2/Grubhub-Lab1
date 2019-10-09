import React,{Component} from "react";
class ModalTemplate extends Component{
    render(){
        var modalId = this.props.id;
        var btnTarget = "#" + modalId;
        return(
            <div>
            <div className="modal" id={modalId}>
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h4 className="modal-title">Add an Item</h4>
                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                </div>
                <div className="modal-body">
                    Modal body..
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-success" onClick = {this.submitClickHandler} data-dismiss="modal">Submit</button>
                    <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
            </div>
        </div>
        )
    }
}