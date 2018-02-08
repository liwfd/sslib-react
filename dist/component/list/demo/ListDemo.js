import React, {Component} from 'react';
import SSForm from '../../form/SSForm';
import SSPage from '../../page/SSPage';
import SSList from '../../list/SSList';
import SSListItem from '../../list/SSListItem'
import SSNavBar from '../../navbar/SSNavBar'
import SSTab from '../../tab/SSTab'
let url = 'https://dev.yonyouccs.com/icop-technology-web/tAStieManWorkInstru/queryList';
class ListDemo extends SSPage {
    constructor(props) {
        super(props);
        this.state = {
            ListData: [],
            url: 'https://dev.yonyouccs.com/icop-technology-web/tAStieManWorkInstru/queryList',
            params: {
                pageSize: 10
            }
        }

    }

    initData = (result) => {
        console.log(result, 'MMMMn')
        this.setState({
            ListData: result
        })
    };
    onLoadMore = (result) => {
        this.setState({
            ListData: result
        })
    };
    onClick = (e) => {
        console.log('onClick', e)
    };
    handleTabClick = () => {
        this.setState({
            params: {
                pageSize: 20
            }
        })
    }

    render() {
        let {url, ListData, params} = this.state;
        return (
            <SSForm>
                <SSNavBar
                    title='例子'
                />
                <SSTab display="none" names={['未完成', '已完成']} handleTabClick={this.handleTabClick}/>

                <SSList multiLine url={url} initData={this.initData} onLoadMore={this.onLoadMore} params={params} displayStyle="2">
                    {
                        ListData.map((item, index) => {
                            return <SSListItem
                                key={item.billCode}
                                type="2"
                                l1={item.billCode}
                                l2="123"
                                onClick={(e) => this.onClick(e)}
                            />
                        })
                    }


                </SSList>


            </SSForm>


        )


    }
}

export default SSForm.create()(ListDemo);