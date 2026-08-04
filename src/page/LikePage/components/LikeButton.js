import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getLikeList, toggleLike } from "../../../features/like/likeSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import useConfirm from "../../../utils/useConfirm";
import Confirm from "../../../common/component/Confirm";

const LikeButton = ({productId, className = ""}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {user} = useSelector((state)=>state.user);
  const {likeList,loading} = useSelector((state)=>state.like);
  const { show, message, openConfirm, handleConfirm, closeConfirm } = useConfirm();

  const liked = likeList.some((item)=>{
    const id = typeof item === "string" ? item : item._id;
    return id === productId;
  })
  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if(!user) {
      openConfirm(()=>{
        navigate("/login")
      },"로그인이 필요한 서비스입니다.")
      return;
    }
    const result = await dispatch(toggleLike(productId));
    
    if(toggleLike.fulfilled.match(result)){
      dispatch(getLikeList());
    }
  }
  return(
    <>
      <button 
        type="button"
        onClick={handleLike}
        disabled={loading}
        aria-label={liked ? "좋아요 해제" : "좋아요"}
        aria-pressed={liked}
        className={className}
      >
        <FontAwesomeIcon 
          icon={liked ? solidHeart : regularHeart}
          className={liked ? "text-red-500" : "text-neutral-400"}
        />
      </button>
      <Confirm
        show={show}
        onConfirm={handleConfirm}
        onCancel={closeConfirm}
        message={message}
      />
    </>
  )
}
export default LikeButton;