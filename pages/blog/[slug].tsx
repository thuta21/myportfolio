import * as React from 'react';
import { useState, useEffect } from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import html from 'remark-html';
import {
  Box,
  Heading,
  VStack,
  Text,
  HStack,
  Flex,
  Tag,
  useColorModeValue,
  Collapse,
  Image,
  AspectRatio,
  Skeleton
} from '@chakra-ui/react';
import { remark } from 'remark';
import prism from 'remark-prism';
import { getTagColor } from '../../components/theme';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { BlogPost } from '../../interfaces/interface';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import PageLayout from 'components/layouts/pageLayout';
import { MotionBox } from 'components/shared/animations/motion';
import { fadeInUp, stagger } from 'components/shared/animations/page-transitions';
import { motion } from 'framer-motion';
import { usePostData } from 'lib/usePostData';
import { LikeButton } from 'components/shared/LikeButton';
import { useLinkColor } from 'components/theme';
import { HeartIcon, CommentIcon, EyeIcon } from 'components/shared/icons';
import DisplayText from 'components/shared/icons/DisplayText';

dayjs.extend(localizedFormat);

export interface AllBlogProps {
  blogDetails: BlogPost;
  articleContent: string;
}

const POST_VIEW_LIMIT = 100;

const ArticlePage: NextPage<AllBlogProps> = ({ articleContent, blogDetails }) => {
  const { totalPostLikes, totalPostViews, isLoading, incrementViews } = usePostData(
    blogDetails?.slug,
    blogDetails?.title
  );
  const [showLikeButton, setShowLikeButton] = useState(false);
  const borderColor = useColorModeValue('transparent', 'gray.700');
  const linkColor = useLinkColor();

  useEffect(() => {
    incrementViews();
    window.addEventListener('scroll', listenToScroll);
    return () => window.removeEventListener('scroll', listenToScroll);
  }, [incrementViews]);

  const listenToScroll = () => {
    if (window.scrollY > 150) setShowLikeButton(true);
    else setShowLikeButton(false);
  };

  return (
    <PageLayout
      title={blogDetails?.title}
      description={blogDetails?.description}
      image={blogDetails?.cover_image}
      keywords={blogDetails?.tags.join(', ')}
    >
      <Collapse in={showLikeButton} animateOpacity>
        <Box position="fixed" right="10%" top="50%" display={['none', 'none', 'none', 'block']}>
          <LikeButton
            id={blogDetails?.slug}
            title={blogDetails?.title}
            linkColor={linkColor}
          />
        </Box>
      </Collapse>
      <motion.div initial="initial" animate="animate" variants={stagger}>
        <VStack marginBottom="5" alignItems="left" textAlign="left">
          {blogDetails?.cover_image && (
            <MotionBox whileHover={{ scale: 1.02 }}>
              <AspectRatio ratio={1.85 / 1} w="100%" h="100%" rounded="xl">
                <Image
                  src={blogDetails?.cover_image}
                  fallback={<Skeleton />}
                  width={'full'}
                  height={'full'}
                  position="absolute"
                  border="2px solid"
                  borderColor={borderColor}
                  rounded="xl"
                  objectFit="cover"
                />
              </AspectRatio>
            </MotionBox>
          )}
          <motion.div variants={fadeInUp}>
            <Heading as="h1" size="xl" mt="2" mb="2">
              {blogDetails?.title}
            </Heading>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <HStack
              justifyContent="space-between"
              isInline
              flexDirection={['column', 'row', 'row']}
            >
              <HStack spacing={1} alignItems="center">
                {blogDetails?.tags.map((tag) => (
                  <Tag size={'md'} padding="0 3px" key={tag} colorScheme={getTagColor(tag)}>
                    {tag}
                  </Tag>
                ))}
              </HStack>
              <HStack spacing={2} isInline pt={['0.5rem', '0', '0']}>
                {blogDetails?.comments_count ? (
                  <Flex alignItems="center">
                    <DisplayText isLoading={false} value={blogDetails.comments_count} />
                    &nbsp;
                    <CommentIcon />
                  </Flex>
                ) : null}
                {blogDetails && totalPostViews > POST_VIEW_LIMIT ? (
                  <Flex alignItems="center">
                    <DisplayText isLoading={isLoading} value={totalPostViews} />
                    &nbsp;
                    <EyeIcon />
                  </Flex>
                ) : null}
              </HStack>
            </HStack>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <Text>{articleContent}</Text>
          </motion.div>
        </VStack>
      </motion.div>
    </PageLayout>
  );
};

// Function to fetch all post slugs
export const getStaticPaths: GetStaticPaths = async () => {
  const postsDirectory = path.join(process.cwd(), 'data', 'posts');
  const files = fs.readdirSync(postsDirectory);
  const paths = files.map((fileName) => ({
    params: { slug: fileName.replace(/\.mdx$/, '') }
  }));

  return {
    paths,
    fallback: false
  };
};

// Function to fetch post data
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as { slug: string };
  const postPath = path.join(process.cwd(), 'data', 'posts', `${slug}.mdx`);

  let markdownWithMeta = '';
  try {
    markdownWithMeta = fs.readFileSync(postPath, 'utf-8');
  } catch (err) {
    console.error('Post file not found:', err);
    return { notFound: true };
  }

  const { data, content } = matter(markdownWithMeta);

  const processedContent = await remark().use(prism).use(html).process(content);
  const articleContent = processedContent.toString();

  const blogDetails = {
    ...data,
    slug
  };

  return {
    props: {
      blogDetails,
      articleContent
    }
  };
};

export default ArticlePage;
