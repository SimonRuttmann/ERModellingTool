import IdentifyingAttributeDragBarSvg from './Components/DragBarSvgs/Attributes/IdentifyingAttribute.svg'
import {ReactComponent as WeakIdentifyingAttributeDragBarSvg} from './Components/DragBarSvgs/Attributes/WeakIdentifyingAttribute.svg'
import {ReactComponent as NormalAttributeDragBarSvg} from './Components/DragBarSvgs/Attributes/NormalAttribute.svg'
import {ReactComponent as StrongEntityDragBarSvg} from './Components/DragBarSvgs/Entities/StrongEntity.svg'
import {ReactComponent as WeakEntityDragBarSvg} from './Components/DragBarSvgs/Entities/WeakEntity.svg'
import {ReactComponent as StrongRelationDragBarSvg} from './Components/DragBarSvgs/Relations/StrongRelation.svg'
import {ReactComponent as WeakRelationDragBarSvg} from './Components/DragBarSvgs/Relations/WeakRelation.svg'
import {ReactComponent as IsAStructureDragBarSvg} from './Components/DragBarSvgs/IsAStructure.svg'


const erTypes = {
    IdentifyingAttribute: <img src={IdentifyingAttributeDragBarSvg} draggable className="draggableContainer" alt={"IdentifyingAttribute"}/>,
    NormalAttribute: <WeakIdentifyingAttributeDragBarSvg/>,
    WeakIdentifyingAttribute: <NormalAttributeDragBarSvg/>,
    StrongEntity: <StrongEntityDragBarSvg/>,
    WeakEntity: <WeakEntityDragBarSvg/>,
    StrongRelation: <StrongRelationDragBarSvg/>,
    WeakRelation: <WeakRelationDragBarSvg/>,
    IsAStructure: <IsAStructureDragBarSvg/>
};

export default erTypes;