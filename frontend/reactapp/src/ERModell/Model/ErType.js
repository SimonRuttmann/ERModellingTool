//Import draggable icons
import IdentifyingAttributeDragBarSvg from '../Components/DraggableSvgs/Attributes/IdentifyingAttribute.svg'
import WeakIdentifyingAttributeDragBarSvg from '../Components/DraggableSvgs/Attributes/WeakIdentifyingAttribute.svg'
import NormalAttributeDragBarSvg from '../Components/DraggableSvgs/Attributes/NormalAttribute.svg'
import MultivaluedAttributeDragBarSvg from '../Components/DraggableSvgs/Attributes/MultivaluedAttribute.svg'
import StrongEntityDragBarSvg from '../Components/DraggableSvgs/Entities/StrongEntity.svg'
import WeakEntityDragBarSvg from '../Components/DraggableSvgs/Entities/WeakEntity.svg'
import StrongRelationDragBarSvg from '../Components/DraggableSvgs/Relations/StrongRelation.svg'
import WeakRelationDragBarSvg from '../Components/DraggableSvgs/Relations/WeakRelation.svg'
import IsAStructureDragBarSvg from '../Components/DraggableSvgs/IsAStructure.svg'

//Import tooltip images
import IdentifyingAttributeDragBarPreviewSvg from '../Components/DragBarPreviewSvg/Attributes/IdentifyingAttribute.svg'
import WeakIdentifyingAttributeDragBarPreviewSvg from '../Components/DragBarPreviewSvg/Attributes/WeakIdentifyingAttribute.svg'
import NormalAttributeDragBarPreviewSvg from '../Components/DragBarPreviewSvg/Attributes/NormalAttribute.svg'
import MultivaluedAttributeDragBarPreviewSvg from '../Components/DragBarPreviewSvg/Attributes/MultivaluedAttribute.svg'
import StrongEntityDragBarPreviewSvg from '../Components/DragBarPreviewSvg/Entities/StrongEntity.svg'
import WeakEntityDragBarPreviewSvg from '../Components/DragBarPreviewSvg/Entities/WeakEntity.svg'
import StrongRelationDragBarPreviewSvg from '../Components/DragBarPreviewSvg/Relations/StrongRelation.svg'
import WeakRelationDragBarPreviewSvg from '../Components/DragBarPreviewSvg/Relations/WeakRelation.svg'
import IsAStructureDragBarPreviewSvg from '../Components/DragBarPreviewSvg/IsAStructure.svg'

//Import components
import IdentifyingAttribute from "../Components/ErObjectComponents/Attributes/IdentifyingAttribute";
import NormalAttribute from "../Components/ErObjectComponents/Attributes/NormalAttribute";
import MultivaluedAttribute from "../Components/ErObjectComponents/Attributes/MultivaluedAttribute";
import WeakIdentifyingAttribute from "../Components/ErObjectComponents/Attributes/WeakIdentifyingAttribute";
import StrongEntity from "../Components/ErObjectComponents/Entities/StrongEntity";
import WeakEntity from "../Components/ErObjectComponents/Entities/WeakEntity";
import StrongRelation from "../Components/ErObjectComponents/Relations/StrongRelation";
import WeakRelation from "../Components/ErObjectComponents/Relations/WeakRelation";
import IsAStructure from "../Components/ErObjectComponents/IsAStructure";


/**
 * Holds all types of categories and contains the equivalent string value
 * @example
 * ERTYPECATEGORY.Attribute
 * returns "Attribute"
 */
export const ERTYPECATEGORY = {
    Attribute: "Attribute",
    Entity: "Entity",
    Relation: "Relation",
    IsAStructure: "IsAStructure"
}


/**
 * Holds all entity relationship types and contains the equivalent string value
 * @example
 * ERTYPENAME.NormalAttribute
 * returns "NormalAttribute"
 */
export const ERTYPENAME = {
    IdentifyingAttribute:       "IdentifyingAttribute",
    NormalAttribute:            "NormalAttribute",
    MultivaluedAttribute:       "MultivaluedAttribute",
    WeakIdentifyingAttribute:   "WeakIdentifyingAttribute",
    StrongEntity:               "StrongEntity",
    WeakEntity:                 "WeakEntity",
    StrongRelation:             "StrongRelation",
    WeakRelation:               "WeakRelation",
    IsAStructure:               "IsAStructure"
};


const erType_DraggableIcon = {
    IdentifyingAttribute:       <img src={IdentifyingAttributeDragBarSvg}       draggable className="leftSideBarElementImage" alt={"IdentifyingAttribute"}/>,
    NormalAttribute:            <img src={NormalAttributeDragBarSvg}            draggable className="leftSideBarElementImage" alt={"NormalAttribute"}/>,
    MultivaluedAttribute:       <img src={MultivaluedAttributeDragBarSvg}       draggable className="leftSideBarElementImage" alt={"MultivaluedAttribute"}/>,
    WeakIdentifyingAttribute:   <img src={WeakIdentifyingAttributeDragBarSvg}   draggable className="leftSideBarElementImage" alt={"WeakIdentifyingAttribute"}/>,
    StrongEntity:               <img src={StrongEntityDragBarSvg}               draggable className="leftSideBarElementImage" alt={"StrongEntity"}/>,
    WeakEntity:                 <img src={WeakEntityDragBarSvg}                 draggable className="leftSideBarElementImage" alt={"WeakEntity"}/>,
    StrongRelation:             <img src={StrongRelationDragBarSvg}             draggable className="leftSideBarElementImage" alt={"StrongRelation"}/>,
    WeakRelation:               <img src={WeakRelationDragBarSvg}               draggable className="leftSideBarElementImage" alt={"WeakRelation"}/>,
    IsAStructure:               <img src={IsAStructureDragBarSvg}               draggable className="leftSideBarElementImage" alt={"IsAStructure"}/>
};


const erType_TooltipImage = {
    IdentifyingAttribute:       <img src={IdentifyingAttributeDragBarPreviewSvg}       draggable className="leftSideBarElementImage" alt={"IdentifyingAttribute"}/>,
    NormalAttribute:            <img src={NormalAttributeDragBarPreviewSvg}            draggable className="leftSideBarElementImage" alt={"NormalAttribute"}/>,
    MultivaluedAttribute:       <img src={MultivaluedAttributeDragBarPreviewSvg}       draggable className="leftSideBarElementImage" alt={"MultivaluedAttribute"}/>,
    WeakIdentifyingAttribute:   <img src={WeakIdentifyingAttributeDragBarPreviewSvg}   draggable className="leftSideBarElementImage" alt={"WeakIdentifyingAttribute"}/>,
    StrongEntity:               <img src={StrongEntityDragBarPreviewSvg}               draggable className="leftSideBarElementImage" alt={"StrongEntity"}/>,
    WeakEntity:                 <img src={WeakEntityDragBarPreviewSvg}                 draggable className="leftSideBarElementImage" alt={"WeakEntity"}/>,
    StrongRelation:             <img src={StrongRelationDragBarPreviewSvg}             draggable className="leftSideBarElementImage" alt={"StrongRelation"}/>,
    WeakRelation:               <img src={WeakRelationDragBarPreviewSvg}               draggable className="leftSideBarElementImage" alt={"WeakRelation"}/>,
    IsAStructure:               <img src={IsAStructureDragBarPreviewSvg}               draggable className="leftSideBarElementImage" alt={"IsAStructure"}/>
}


const erType_TooltipDescription = {
    IdentifyingAttribute:       <p>This is the description for a Identifying Attribute</p>,
    NormalAttribute:            <p>This is the description for a Normal Attribute</p>,
    MultivaluedAttribute:       <p>This is the description for a Multivalued Attribute</p>,
    WeakIdentifyingAttribute:   <p>This is the description for a Weak identifying Attribute</p>,
    StrongEntity:               <p>This is the description for a Strong Entity</p>,
    WeakEntity:                 <p>This is the description for a Weak Entity</p>,
    StrongRelation:             <p>This is the description for a Strong Relation</p>,
    WeakRelation:               <p>This is the description for a Weak Relation</p>,
    IsAStructure:               <p>This is the description for a IsA Structure</p>
}


const erType_TooltipTitle = {
    IdentifyingAttribute:       <h1>Identifying Attribute</h1>,
    NormalAttribute:            <h1>Normal Attribute</h1>,
    MultivaluedAttribute:       <h1>Multivalued Attribute</h1>,
    WeakIdentifyingAttribute:   <h1>Weak identifying Attribute</h1>,
    StrongEntity:               <h1>Strong Entity</h1>,
    WeakEntity:                 <h1>Weak Entity</h1>,
    StrongRelation:             <h1>Strong Relation</h1>,
    WeakRelation:               <h1>Weak Relation</h1>,
    IsAStructure:               <h1>Is A Structure</h1>
}

/**
 * @summary Use this method to receive the component for a corresponding erType
 * @see ERTYPENAME
 * @see ERTYPE
 * @param type The string representation of the erType
 * @param props The props, which will be forwarded to the component
 * @returns {JSX.Element} The component based on the given erType
 */
export const resolveErComponent = (type, props) => {
    switch (type) {
        case ERTYPENAME.IdentifyingAttribute: return <IdentifyingAttribute {...props}/>
        case ERTYPENAME.NormalAttribute: return <NormalAttribute {...props}/>
        case ERTYPENAME.MultivaluedAttribute: return <MultivaluedAttribute {...props}/>
        case ERTYPENAME.WeakIdentifyingAttribute: return <WeakIdentifyingAttribute {...props}/>
        case ERTYPENAME.StrongEntity: return <StrongEntity {...props}/>
        case ERTYPENAME.WeakEntity: return <WeakEntity {...props}/>
        case ERTYPENAME.StrongRelation: return <StrongRelation {...props}/>
        case ERTYPENAME.WeakRelation: return <WeakRelation {...props}/>
        case ERTYPENAME.IsAStructure: return <IsAStructure {...props}/>
        default: return <div/>
    }
}

/**
 * @summary Filters the erTypes for a given category
 * @param category The category, which will be filtered after
 * @returns {*[]} An array of erType names as strings
 */
export const returnNamesOfCategory = (category) => {

    let arrayOfTypes = Object.values(ERTYPE)
    let categoryFiltered = arrayOfTypes.filter(erType => erType.category === category)

    return categoryFiltered.map(er => er.name)
}


/**
 * Holds all data for a entity relationship type <br>
 * The following entries are avaiable for each entity relationship type: <br>
 * - name: String
 * - category: String
 * - icon: Image
 * - toolTipTitle: JSXElement
 * - toolTipDescription: JSXElement
 * - toolTipImage: Image
 *
 * @see ERTYPENAME
 * @see ERTYPE
 */
export const ERTYPE = {

    IdentifyingAttribute:
        {
            name: ERTYPENAME.IdentifyingAttribute,
            category: ERTYPECATEGORY.Attribute,
            icon: erType_DraggableIcon.IdentifyingAttribute,
            toolTipTitle: erType_TooltipTitle.IdentifyingAttribute,
            toolTipDescription: erType_TooltipDescription.IdentifyingAttribute,
            toolTipImage: erType_TooltipImage.IdentifyingAttribute,
        },

    NormalAttribute:
        {
            name: ERTYPENAME.NormalAttribute,
            category: ERTYPECATEGORY.Attribute,
            icon: erType_DraggableIcon.NormalAttribute,
            toolTipTitle: erType_TooltipTitle.NormalAttribute,
            toolTipDescription: erType_TooltipDescription.NormalAttribute,
            toolTipImage: erType_TooltipImage.NormalAttribute,
        },

    MultivaluedAttribute:
        {
            name: ERTYPENAME.MultivaluedAttribute,
            category: ERTYPECATEGORY.Attribute,
            icon: erType_DraggableIcon.MultivaluedAttribute,
            toolTipTitle: erType_TooltipTitle.MultivaluedAttribute,
            toolTipDescription: erType_TooltipDescription.MultivaluedAttribute,
            toolTipImage: erType_TooltipImage.MultivaluedAttribute,
        },

    WeakIdentifyingAttribute:
        {
            name: ERTYPENAME.WeakIdentifyingAttribute,
            category: ERTYPECATEGORY.Attribute,
            icon: erType_DraggableIcon.WeakIdentifyingAttribute,
            toolTipTitle: erType_TooltipTitle.WeakIdentifyingAttribute,
            toolTipDescription: erType_TooltipDescription.WeakIdentifyingAttribute,
            toolTipImage: erType_TooltipImage.WeakIdentifyingAttribute,
        },

    StrongEntity:
        {
            name: ERTYPENAME.StrongEntity,
            category: ERTYPECATEGORY.Entity,
            icon: erType_DraggableIcon.StrongEntity,
            toolTipTitle: erType_TooltipTitle.StrongEntity,
            toolTipDescription: erType_TooltipDescription.StrongEntity,
            toolTipImage: erType_TooltipImage.StrongEntity,
        },

    WeakEntity:
        {
            name: ERTYPENAME.WeakEntity,
            category: ERTYPECATEGORY.Entity,
            icon: erType_DraggableIcon.WeakEntity,
            toolTipTitle: erType_TooltipTitle.WeakEntity,
            toolTipDescription: erType_TooltipDescription.WeakEntity,
            toolTipImage: erType_TooltipImage.WeakEntity,
        },

    StrongRelation:
        {
            name: ERTYPENAME.StrongRelation,
            category: ERTYPECATEGORY.Relation,
            icon: erType_DraggableIcon.StrongRelation,
            toolTipTitle: erType_TooltipTitle.StrongRelation,
            toolTipDescription: erType_TooltipDescription.StrongRelation,
            toolTipImage: erType_TooltipImage.StrongRelation,
        },

    WeakRelation:
        {
            name: ERTYPENAME.WeakRelation,
            category: ERTYPECATEGORY.Relation,
            icon: erType_DraggableIcon.WeakRelation,
            toolTipTitle: erType_TooltipTitle.WeakRelation,
            toolTipDescription: erType_TooltipDescription.WeakRelation,
            toolTipImage: erType_TooltipImage.WeakRelation,
        },

    IsAStructure:
        {
            name: ERTYPENAME.IsAStructure,
            category: ERTYPECATEGORY.IsAStructure,
            icon: erType_DraggableIcon.IsAStructure,
            toolTipTitle: erType_TooltipTitle.IsAStructure,
            toolTipDescription: erType_TooltipDescription.IsAStructure,
            toolTipImage: erType_TooltipImage.IsAStructure,
        }
}