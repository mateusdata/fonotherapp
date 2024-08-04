import { Input, XStack } from "tamagui"
import { AntDesign } from '@expo/vector-icons';

const SearchInput = (props:any) => {
    <XStack  {...props} style={{alignItems:'center', ...props.style}}><Input width='$19' style={{paddingLeft:35}}/><AntDesign name='search1' size={20}  style={{position:'absolute', marginLeft:10}}/></XStack>
}

export default SearchInput;