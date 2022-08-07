//Import draggable icons
import IdentifyingAttributeDragBarSvg from '../../Resources/DraggableSvgs/Attributes/IdentifyingAttribute.svg'
import WeakIdentifyingAttributeDragBarSvg from '../../Resources/DraggableSvgs/Attributes/WeakIdentifyingAttribute.svg'
import NormalAttributeDragBarSvg from '../../Resources/DraggableSvgs/Attributes/NormalAttribute.svg'
import MultivaluedAttributeDragBarSvg from '../../Resources/DraggableSvgs/Attributes/MultivaluedAttribute.svg'
import StrongEntityDragBarSvg from '../../Resources/DraggableSvgs/Entities/StrongEntity.svg'
import WeakEntityDragBarSvg from '../../Resources/DraggableSvgs/Entities/WeakEntity.svg'
import StrongRelationDragBarSvg from '../../Resources/DraggableSvgs/Relations/StrongRelation.svg'
import WeakRelationDragBarSvg from '../../Resources/DraggableSvgs/Relations/WeakRelation.svg'
import IsAStructureDragBarSvg from '../../Resources/DraggableSvgs/IsAStructure/IsAStructure.svg'

//Import tooltip images
import IdentifyingAttributeDragBarPreviewSvg from '../../Resources/DragBarToolTipSvg/Attributes/IdentifyingAttribute.svg'
import WeakIdentifyingAttributeDragBarPreviewSvg from '../../Resources/DragBarToolTipSvg/Attributes/WeakIdentifyingAttribute.svg'
import NormalAttributeDragBarPreviewSvg from '../../Resources/DragBarToolTipSvg/Attributes/NormalAttribute.svg'
import MultivaluedAttributeDragBarPreviewSvg from '../../Resources/DragBarToolTipSvg/Attributes/MultivaluedAttribute.svg'
import StrongEntityDragBarPreviewSvg from '../../Resources/DragBarToolTipSvg/Entities/StrongEntity.svg'
import WeakEntityDragBarPreviewSvg from '../../Resources/DragBarToolTipSvg/Entities/WeakEntity.svg'
import StrongRelationDragBarPreviewSvg from '../../Resources/DragBarToolTipSvg/Relations/StrongRelation.svg'
import WeakRelationDragBarPreviewSvg from '../../Resources/DragBarToolTipSvg/Relations/WeakRelation.svg'
import IsAStructureDragBarPreviewSvg from '../../Resources/DragBarToolTipSvg/IsAStructure/IsAStructure.svg'

//Import components
import IdentifyingAttribute from "../../Components/DrawingBoardRenderedElements/Attributes/IdentifyingAttribute";
import NormalAttribute from "../../Components/DrawingBoardRenderedElements/Attributes/NormalAttribute";
import MultivaluedAttribute from "../../Components/DrawingBoardRenderedElements/Attributes/MultivaluedAttribute";
import WeakIdentifyingAttribute from "../../Components/DrawingBoardRenderedElements/Attributes/WeakIdentifyingAttribute";
import StrongEntity from "../../Components/DrawingBoardRenderedElements/Entities/StrongEntity";
import WeakEntity from "../../Components/DrawingBoardRenderedElements/Entities/WeakEntity";
import StrongRelation from "../../Components/DrawingBoardRenderedElements/Relations/StrongRelation";
import WeakRelation from "../../Components/DrawingBoardRenderedElements/Relations/WeakRelation";
import IsAStructure from "../../Components/DrawingBoardRenderedElements/IsAStructure/IsAStructure";
import Table from "../../Components/DrawingBoardRenderedElements/RelationalTable/Table";


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

const erType_displayName = {
    IdentifyingAttribute:       "Identifying Attribute",
    NormalAttribute:            "Normal Attribute",
    MultivaluedAttribute:       "Multivalued Attribute",
    WeakIdentifyingAttribute:   "Weak Identifying Attribute",
    StrongEntity:               "Strong Entity",
    WeakEntity:                 "Weak Entity",
    StrongRelation:             "Strong Relation",
    WeakRelation:               "Weak Relation",
    IsAStructure:               "IsA-Structure"
}

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
    IdentifyingAttribute:
        <div className="erDescriptions">
            <p>
                A identifying attribute or a group of identifying           <br/>
                attributes are used as a key for a entity.                  <br/>
            </p>
            <p>Examples are:</p>
            <ul>
                <li>The matriculation  number of a student</li>
                <li>The license plate of a car</li>
            </ul>
        </div>,

    NormalAttribute:
        <div className="erDescriptions">
            <p>A normal attribute is used to hold data of an entity</p>
            <p>Examples are:</p>
            <ul>
                <li>The size of an object</li>
                <li>The forename of a person</li>
            </ul>
        </div>,

    MultivaluedAttribute:
        <div className="erDescriptions">
            <p>A multivalued attribute can hold multiple values for an entity</p>
            <p>Examples are:</p>
            <ul>
                <li>The address`s of a person</li>
                <li>Event dates for an recurring event</li>
            </ul>
        </div>,
    WeakIdentifyingAttribute:
        <div className="erDescriptions">
            <p>Weak identifying attributes are used to partially identify weak entities</p>
            <p>Examples are:</p>
            <ul>
                <li>The page number of a book</li>
                <li>An item number of a order</li>
            </ul>
        </div>,
    StrongEntity:
        <div className="erDescriptions">
            <p> A strong entity is used to represent individually           <br/>
                identifiable objects of the real world,                     <br/>
                which can hold a set of attributes to store data            <br/>
                of the object.
            </p>
            <p>Examples are:</p>
            <ul>
                <li>A Person</li>
                <li>A Car</li>
            </ul>
        </div>,
    WeakEntity:
        <div className="erDescriptions">
            <p> A weak entity is used to represent           <br/>
                partially unique objects of the real world,  <br/>
                It is unique to a corresponding              <br/>
                strong entity entry.
            </p>
            <p>Examples are:</p>
            <ul>
                <li>A page of a book </li>
                <li>A item of a order</li>
            </ul>
        </div>,
    StrongRelation:
        <div className="erDescriptions">
            <p> A strong relations expresses how multiple     <br/>
                entities correspond to each other.            <br/>
            </p>
            <p>Examples are:</p>
            <ul>
                <li>A person OWNS multiple cars</li>
                <li>A car is DRIVEN BY multiple persons</li>
            </ul>
        </div>,
    WeakRelation:
        <div className="erDescriptions">
            <p> A weak relations expresses how a strong         <br/>
                entity entry correspond to a weak entity.
            </p>
            <p>Examples are:</p>
            <ul>
                <li>A folder HAS multiple pages</li>
                <li>A order CONTAINS order items</li>
            </ul>
        </div>,
    IsAStructure:
        <div className="erDescriptions">
            <p> A isa expresses, that a strong entity           <br/>
                type is also part of another strong entity.
            </p>
            <p>Examples are:</p>
            <ul>
                <li>An external professor is a professor</li>
                <li>A internal professor is a professor</li>
            </ul>
        </div>,
}


const erType_TooltipTitle = {
    IdentifyingAttribute:       <h1>Identifying Attribute</h1>,
    NormalAttribute:            <h1>Normal Attribute</h1>,
    MultivaluedAttribute:       <h1>Multivalued Attribute</h1>,
    WeakIdentifyingAttribute:   <h1>Weak identifying <br/> Attribute</h1>,
    StrongEntity:               <h1>Strong Entity</h1>,
    WeakEntity:                 <h1>Weak Entity</h1>,
    StrongRelation:             <h1>Strong Relation</h1>,
    WeakRelation:               <h1>Weak Relation</h1>,
    IsAStructure:               <h1>Is A Structure</h1>
}

export const RELATIONALTYPENAME = {
    Table: "Table"
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
        case RELATIONALTYPENAME.Table: return <Table {...props}/>
        default: return <Table {...props}/>
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
            displayName: erType_displayName.IdentifyingAttribute,
        },

    NormalAttribute:
        {
            name: ERTYPENAME.NormalAttribute,
            category: ERTYPECATEGORY.Attribute,
            icon: erType_DraggableIcon.NormalAttribute,
            toolTipTitle: erType_TooltipTitle.NormalAttribute,
            toolTipDescription: erType_TooltipDescription.NormalAttribute,
            toolTipImage: erType_TooltipImage.NormalAttribute,
            displayName: erType_displayName.NormalAttribute,
        },

    MultivaluedAttribute:
        {
            name: ERTYPENAME.MultivaluedAttribute,
            category: ERTYPECATEGORY.Attribute,
            icon: erType_DraggableIcon.MultivaluedAttribute,
            toolTipTitle: erType_TooltipTitle.MultivaluedAttribute,
            toolTipDescription: erType_TooltipDescription.MultivaluedAttribute,
            toolTipImage: erType_TooltipImage.MultivaluedAttribute,
            displayName: erType_displayName.MultivaluedAttribute,
        },

    WeakIdentifyingAttribute:
        {
            name: ERTYPENAME.WeakIdentifyingAttribute,
            category: ERTYPECATEGORY.Attribute,
            icon: erType_DraggableIcon.WeakIdentifyingAttribute,
            toolTipTitle: erType_TooltipTitle.WeakIdentifyingAttribute,
            toolTipDescription: erType_TooltipDescription.WeakIdentifyingAttribute,
            toolTipImage: erType_TooltipImage.WeakIdentifyingAttribute,
            displayName: erType_displayName.WeakIdentifyingAttribute,
        },

    StrongEntity:
        {
            name: ERTYPENAME.StrongEntity,
            category: ERTYPECATEGORY.Entity,
            icon: erType_DraggableIcon.StrongEntity,
            toolTipTitle: erType_TooltipTitle.StrongEntity,
            toolTipDescription: erType_TooltipDescription.StrongEntity,
            toolTipImage: erType_TooltipImage.StrongEntity,
            displayName: erType_displayName.StrongEntity,
        },

    WeakEntity:
        {
            name: ERTYPENAME.WeakEntity,
            category: ERTYPECATEGORY.Entity,
            icon: erType_DraggableIcon.WeakEntity,
            toolTipTitle: erType_TooltipTitle.WeakEntity,
            toolTipDescription: erType_TooltipDescription.WeakEntity,
            toolTipImage: erType_TooltipImage.WeakEntity,
            displayName: erType_displayName.WeakEntity,
        },

    StrongRelation:
        {
            name: ERTYPENAME.StrongRelation,
            category: ERTYPECATEGORY.Relation,
            icon: erType_DraggableIcon.StrongRelation,
            toolTipTitle: erType_TooltipTitle.StrongRelation,
            toolTipDescription: erType_TooltipDescription.StrongRelation,
            toolTipImage: erType_TooltipImage.StrongRelation,
            displayName: erType_displayName.StrongRelation,
        },

    WeakRelation:
        {
            name: ERTYPENAME.WeakRelation,
            category: ERTYPECATEGORY.Relation,
            icon: erType_DraggableIcon.WeakRelation,
            toolTipTitle: erType_TooltipTitle.WeakRelation,
            toolTipDescription: erType_TooltipDescription.WeakRelation,
            toolTipImage: erType_TooltipImage.WeakRelation,
            displayName: erType_displayName.WeakRelation,
        },

    IsAStructure:
        {
            name: ERTYPENAME.IsAStructure,
            category: ERTYPECATEGORY.IsAStructure,
            icon: erType_DraggableIcon.IsAStructure,
            toolTipTitle: erType_TooltipTitle.IsAStructure,
            toolTipDescription: erType_TooltipDescription.IsAStructure,
            toolTipImage: erType_TooltipImage.IsAStructure,
            displayName: erType_displayName.IsAStructure,
        }
}