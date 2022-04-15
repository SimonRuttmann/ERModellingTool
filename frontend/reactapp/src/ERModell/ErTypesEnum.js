import IdentifyingAttributeDragBarSvg from './Components/DraggableSvgs/Attributes/IdentifyingAttribute.svg'
import WeakIdentifyingAttributeDragBarSvg from './Components/DraggableSvgs/Attributes/WeakIdentifyingAttribute.svg'
import NormalAttributeDragBarSvg from './Components/DraggableSvgs/Attributes/NormalAttribute.svg'
import MultivaluedAttributeDragBarSvg from './Components/DraggableSvgs/Attributes/MultivaluedAttribute.svg'
import StrongEntityDragBarSvg from './Components/DraggableSvgs/Entities/StrongEntity.svg'
import WeakEntityDragBarSvg from './Components/DraggableSvgs/Entities/WeakEntity.svg'
import StrongRelationDragBarSvg from './Components/DraggableSvgs/Relations/StrongRelation.svg'
import WeakRelationDragBarSvg from './Components/DraggableSvgs/Relations/WeakRelation.svg'
import IsAStructureDragBarSvg from './Components/DraggableSvgs/IsAStructure.svg'


const erTypes = {
    IdentifyingAttribute: <img src={IdentifyingAttributeDragBarSvg} draggable className="leftSideBarElementImage" alt={"IdentifyingAttribute"}/>,
    NormalAttribute: <img src={WeakIdentifyingAttributeDragBarSvg} draggable className="leftSideBarElementImage" alt={"WeakIdentifyingAttributeDragBarSvg"}/>,
    MultivaluedAttribute: <img src={NormalAttributeDragBarSvg} draggable className="leftSideBarElementImage" alt={"NormalAttributeDragBarSvg"}/>,
    WeakIdentifyingAttribute: <img src={MultivaluedAttributeDragBarSvg} draggable className="leftSideBarElementImage" alt={"MultivaluedAttributeDragBarSvg"}/>,
    StrongEntity: <img src={StrongEntityDragBarSvg} draggable className="leftSideBarElementImage" alt={"StrongEntityDragBarSvg"}/>,
    WeakEntity: <img src={WeakEntityDragBarSvg} draggable className="leftSideBarElementImage" alt={"WeakEntityDragBarSvg"}/>,
    StrongRelation: <img src={StrongRelationDragBarSvg} draggable className="leftSideBarElementImage" alt={"StrongRelationDragBarSvg"}/>,
    WeakRelation: <img src={WeakRelationDragBarSvg} draggable className="leftSideBarElementImage" alt={"WeakRelationDragBarSvg"}/>,
    IsAStructure: <img src={IsAStructureDragBarSvg} draggable className="leftSideBarElementImage" alt={"IsAStructureDragBarSvg"}/>
};

export default erTypes;