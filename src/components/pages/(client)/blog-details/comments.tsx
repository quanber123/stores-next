import { Icons } from '@/enum/enum';
import { Blog } from '@/types/types';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  FacebookShareButton,
  FacebookIcon,
  PinterestShareButton,
  PinterestIcon,
  TwitterShareButton,
  TwitterIcon,
} from 'next-share';
import { formatTime } from '@/lib/utils/format';
import { useSelector } from 'react-redux';
import { userInfo } from '@/lib/redux/slice/userSlice';
import Image from 'next/image';
import { ModalContext } from '@/context/ModalProvider';
import { useRouter } from 'next/navigation';
import { usePostCommentBlogMutation } from '@/lib/redux/query/blogQuery';
import LazyLoadImage from '@/components/(ui)/lazyloadImage';
type Props = {
  comment: any;
  blog: Blog;
};
const Comments: React.FC<Props> = ({ comment, blog }) => {
  const { comments } = comment;
  const { _id, title, tags, imgSrc } = blog;
  const [
    postComment,
    {
      data: commentData,
      isSuccess: isSuccessPostComment,
      isLoading: isLoadingPostComment,
    },
  ] = usePostCommentBlogMutation();
  const router = useRouter();
  const { setVisibleModal } = useContext(ModalContext);
  const user = useSelector(userInfo);
  const commentRef = useRef<HTMLParagraphElement | null>(null);
  const [isFocusComment, setIsFocusComment] = useState(false);
  const renderedComments = useMemo(() => {
    if (!comments) {
      return [];
    }
    return comments?.map((c: any) => {
      return (
        <div key={c.created_at} className='w-full flex items-start gap-[20px]'>
          <LazyLoadImage
            width={32}
            height={32}
            className='w-[32px] h-[32px] rounded-full object-cover'
            src={c.user?.image}
            alt={c.user?.name}
          />
          <div className='w-full px-4 py-2 md:p-4 bg-neutral-200 rounded-[16px] md:rounded-[26px] flex flex-col gap-[5px]'>
            <div className='text-sm flex flex-col md:flex-row justify-between'>
              <h6 className='text-gray-700 font-bold order-2 md:order-1'>
                {c.user?.name}
              </h6>
              <p className='text-semiBoldGray font-bold order-1 md:order-2 line-clamp-1'>
                {formatTime(c.created_at)}
              </p>
            </div>
            <div>
              <p>{c.text}</p>
            </div>
          </div>
        </div>
      );
    });
  }, [comments]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLParagraphElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        console.log('key down');
        if (!commentRef.current?.textContent) {
          setVisibleModal({
            visibleToastModal: {
              type: 'warning',
              message: 'Comment can not be null!',
            },
          });
        } else {
          postComment({ id: _id, text: commentRef.current?.textContent });
        }
      }
    },
    [postComment, _id, commentRef.current, setVisibleModal]
  );
  useEffect(() => {
    if (isSuccessPostComment && commentData) {
      if (commentRef.current) {
        commentRef.current.textContent = '';
      }
    }
  }, [isSuccessPostComment, commentData]);
  const redirectToVerified = useCallback(() => {
    router.push('/verified');
  }, [router]);
  return (
    <section className='flex flex-col gap-8 text-sm md:text-base'>
      <div className='py-4 border-t border-b border-gray-400 flex flex-col sm:flex-row justify-between sm:items-center gap-4'>
        <div className='flex items-center gap-4'>
          <span dangerouslySetInnerHTML={{ __html: Icons.comment_icon }}></span>
          <p>
            {comments?.length > 1
              ? `${comments?.length} comments`
              : `${comments?.length > 0 ? comments.length : 0} comment`}
          </p>
        </div>
        <div className='ml-auto flex items-center gap-2 text-lg font-bold'>
          <p>Share:</p>
          <FacebookShareButton
            url={window.location.href}
            quote={title}
            hashtag={tags.join('#')}
          >
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <PinterestShareButton
            url={window.location.href}
            media={imgSrc}
            description={title}
          >
            <PinterestIcon size={32} round />
          </PinterestShareButton>
          <TwitterShareButton
            url={window.location.href}
            title={title}
            hashtags={tags.map((t) => t.name)}
          >
            <TwitterIcon size={32} round />
          </TwitterShareButton>
        </div>
      </div>
      <div className='flex flex-col gap-6 h-full max-h-[50vh] overflow-y-auto'>
        {renderedComments?.length > 0 ? (
          renderedComments
        ) : (
          <p className='text-2xl'>Be the first to comment.</p>
        )}
      </div>
      <div>
        {user && user?.isVerified && (
          <div className='flex items-start gap-[10px] md:gap-[20px]'>
            <Image
              className='w-[32px] h-[32px] rounded-full'
              width={32}
              height={32}
              src={user.image}
              alt={user.name}
              loading='lazy'
            />
            <div className='relative w-full text-darkGray'>
              <p
                ref={commentRef}
                onFocus={() => setIsFocusComment(true)}
                onBlur={() => setIsFocusComment(false)}
                onKeyDown={handleKeyDown}
                contentEditable
                className='py-2 px-4 w-full min-h-[36px] rounded-[24px] bg-gray-200 z-20'
                id='comment'
              ></p>
              <p
                className={`${
                  isFocusComment ? 'hidden' : 'block'
                } absolute top-2 left-4`}
                onClick={() => setIsFocusComment(true)}
              >
                Write comment...
              </p>
              <button
                className={`absolute bottom-[10px] right-[5%] md:right-[2%] z-50 text-gray-500 hover:text-blue-500 transition-colors ${
                  !commentRef.current?.textContent ? 'text-blue-500' : ''
                }`}
                disabled={
                  isLoadingPostComment || !commentRef.current?.textContent
                }
                aria-label='Send-comment'
                onClick={() =>
                  postComment({
                    id: _id,
                    text: !commentRef.current?.textContent,
                  })
                }
                dangerouslySetInnerHTML={{ __html: Icons.paper_plane_icon }}
              ></button>
            </div>
          </div>
        )}
        {!user && (
          <div className='flex justify-center py-4 bg-neutral-200 rounded-[4px] text-gray-700'>
            <p>
              Please{' '}
              <span
                className='mx-[4px] text-violet-500 font-bold cursor-pointer'
                onClick={() => setVisibleModal('visibleLoginModal')}
              >
                Login
              </span>{' '}
              or{' '}
              <span
                className='mx-[4px] text-violet-500 font-bold cursor-pointer'
                onClick={() => setVisibleModal('visibleRegisterModal')}
              >
                Register
              </span>{' '}
              to comment.
            </p>
          </div>
        )}
        {user && !user.isVerified && (
          <div className='flex justify-center py-4 bg-neutral-200 rounded-[4px] text-gray-700'>
            <p>
              Please{' '}
              <button
                className='mx-[4px] text-violet-500 font-bold cursor-pointer'
                onClick={redirectToVerified}
              >
                verify
              </button>{' '}
              your account to comment.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Comments;
