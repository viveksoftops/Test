import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import {Cell,Section,Separator} from 'react-native-tableview-simple';
import moment from 'moment';

export default class List extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            page: 0,
            pageCount: 0,
            posts: []
        }
    }

    componentDidMount(){
        this.getPosts(this.state.page);
        this.timer = setInterval(()=>{ 
            this.getPosts(this.state.page);
        },10000);
    }

    componentWillMount(){
        clearInterval(this.timer);
    }

    getPosts = (page,load) => {

        if(page!=0 && page>(this.state.pageCount-1))return;

        this.setState({
            loadMore: load?true:false,
            loading: !load
        })
        fetch(`https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${page}`)
            .then(response=>response.json())
            .then((response)=>{
                this.setState({loading:false,loadMore:false});
                if(response){
                    this.setState({page:page+1,pageCount:response.nbPages,posts:[...this.state.posts,...response.hits]});
                }
            }).catch(err=>{
                this.setState({loading:false,loadMore:false});
                alert(err.message);
            })
    }



    render(){
        return(
            <View style={{flex:1}}>

                <FlatList 
                    data={this.state.posts}
                    style={{flex:1}}
                    keyExtractor={(item,index)=>index}
                    renderItem={({item,separators})=>{
                        return(
                            <TouchableOpacity onPress={()=>this.props.navigation.navigate('Detail',{item})}>
                                <Section>
                                    <Cell title={item.title} onHighlightRow={separators.highlight} onUnHighlightRow={separators.unhighlight}/>
                                    <Cell title={item.url} onHighlightRow={separators.highlight} onUnHighlightRow={separators.unhighlight}/>
                                    <Cell title={item.author} onHighlightRow={separators.highlight} onUnHighlightRow={separators.unhighlight}/>
                                    <Cell title={moment(item.created_at).format("DD MMM YYYY hh:mm a")} onHighlightRow={separators.highlight} onUnHighlightRow={separators.unhighlight}/>
                                </Section>
                            </TouchableOpacity>
                        );
                    }}
                    ItemSeparatorComponent={({highlight})=>{
                        return <Separator isHidden={highlight}/>
                    }}
                    onEndReached={({distanceFromEnd})=>{
                        if(!this.state.loading){
                            this.setState({loadMore:true});
                            this.getPosts(this.state.page,true);
                        }
                        
                    }}
                    onEndReachedThreshold={1}
                    ListFooterComponent={()=>{
                        return(
                            this.state.loadMore?<View style={{padding:10,justifyContent:'center',alignItems:'center'}}>
                                <ActivityIndicator />
                                </View>:null
                        )
                    }}
                    />

                {this.state.loading?<View style={styles.loadingComponent}>
                    <ActivityIndicator size={'large'} color={'#fff'}/>
                </View>:null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1
    },
    loadingComponent:{
        position: 'absolute',
        width:'100%',
        height:'100%',
        backgroundColor:'#00000090',
        justifyContent:'center',
        alignItems:'center'
    }
});