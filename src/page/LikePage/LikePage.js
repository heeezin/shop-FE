import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLikeList } from "../../features/like/likeSlice";
import ProductCard from "../LandingPage/components/ProductCard";

const LikePage = () => {
  const dispatch = useDispatch();
  const {likeList,loading} = useSelector((state)=>state.like);

  useEffect(()=>{
    dispatch(getLikeList());
  },[dispatch]);

  return(
    <main className="mx-auto max-w-[1600px] px-8 py-14">
    <div className="grid grid-cols-[260px_1fr] gap-16">
        <aside className="sticky top-24 h-fit">
          <h1 className="text-5xl font-black">
              LIKE
          </h1>
          <hr className="my-6"/>
      </aside>

      {loading ? (
        <div className="flex min-h-80 items-center justify-center">
          Loading...
        </div>
      ) : likeList.length > 0 ? (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {likeList.map((item) => (
            <ProductCard key={item._id} item={item} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-80 items-center justify-center">
          좋아요한 상품이 없습니다.
        </div>
      )}

    </div>

</main>
  )
}
export default LikePage;