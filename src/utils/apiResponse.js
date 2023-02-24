export default ({data=[],errors=[]})=>{
        return {
            status:!errors.length,
            data,
            errors
    }
}