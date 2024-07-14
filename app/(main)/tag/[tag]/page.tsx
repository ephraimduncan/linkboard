type TagPageProps = {
  params: { tag: string };
};

export default function TagPage({ params }: TagPageProps) {
  return <div>My Tag: {params.tag}</div>;
}
