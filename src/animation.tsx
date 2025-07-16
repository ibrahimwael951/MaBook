export const FadeUp ={
    initial:{opacity:0, y:60},
    exit:{opacity:0, y:60},
}
export const ViewPort={
    viewport:{once:true,amount:0.5},
    whileInView:{opacity:1, y:0 , x:0 ,scale:1},
    transition:{duration:0.5},
}